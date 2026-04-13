from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from miGanado.models import (
    Animal,
    ConfigNotificaciones,
    Lote,
    Notificacion,
    Sangrado,
    Tacto,
    Tratamiento,
    Usuario,
    Vacunacion,
)


MOCK_USER = {
    "nombre": "Usuario Mock",
    "nombre_campo": "Estancia La Esperanza",
    "correo_electronico": "mock@mi-ganado.com",
    "contrasenia": "1234",
    "tipo": "cliente",
}


class Command(BaseCommand):
    help = "Elimina el usuario mock previo y regenera datos demo consistentes."

    def handle(self, *args, **options):
        with transaction.atomic():
            deleted_user_ids = self._delete_previous_mock_users()
            user = Usuario.objects.create(**MOCK_USER)

            ConfigNotificaciones.objects.update_or_create(
                usuario=user,
                defaults={
                    "recibir_notificaciones_lote": True,
                    "recibir_notificaciones_tratamiento": True,
                    "recibir_notificaciones_tacto": True,
                    "recibir_notificaciones_sangrado": True,
                    "recibir_notificaciones_estadisticas": True,
                },
            )

            lots = self._create_lots(user)
            animals = self._create_animals(user, lots)
            self._attach_animals_to_lots(lots, animals)
            self._create_related_records(user)

        deleted_ids_display = ", ".join(str(user_id) for user_id in deleted_user_ids) or "ninguno"
        self.stdout.write(self.style.SUCCESS("Datos mock generados correctamente."))
        self.stdout.write(f"Usuario mock anterior eliminado: {deleted_ids_display}")
        self.stdout.write(f"Nuevo usuario mock ID: {user.id}")
        self.stdout.write(f"Email: {MOCK_USER['correo_electronico']}")
        self.stdout.write(f"Contrasenia: {MOCK_USER['contrasenia']}")

    def _delete_previous_mock_users(self):
        mock_users = list(
            Usuario.objects.filter(correo_electronico__iexact=MOCK_USER["correo_electronico"]).values_list("id", flat=True)
        )

        if not mock_users:
            return []

        Notificacion.objects.filter(userId__in=mock_users).delete()
        Vacunacion.objects.filter(userId__in=mock_users).delete()
        Tacto.objects.filter(userId__in=mock_users).delete()
        Sangrado.objects.filter(userId__in=mock_users).delete()
        Tratamiento.objects.filter(userId__in=mock_users).delete()
        Animal.objects.filter(userId__in=mock_users).delete()
        Lote.objects.filter(usuario_id__in=mock_users).delete()
        ConfigNotificaciones.objects.filter(usuario_id__in=mock_users).delete()
        Usuario.objects.filter(id__in=mock_users).delete()

        return mock_users

    def _create_lots(self, user):
        lots = {}

        lot_definitions = [
            {
                "key": "toros",
                "nombre_lote": "Toros",
                "numero": 1,
                "capacidad": 4,
                "capacidad_max": 4,
                "tipo_animal": "toro",
            },
            {
                "key": "vacas_venta",
                "nombre_lote": "Vacas Venta",
                "numero": 2,
                "capacidad": 45,
                "capacidad_max": 50,
                "tipo_animal": "vaca",
            },
            {
                "key": "vacas_cria",
                "nombre_lote": "Vacas Cria",
                "numero": 3,
                "capacidad": 40,
                "capacidad_max": 45,
                "tipo_animal": "vaca",
            },
        ]

        for lot_data in lot_definitions:
            key = lot_data.pop("key")
            lots[key] = Lote.objects.create(usuario=user, **lot_data)

        return lots

    def _create_animals(self, user, lots):
        animals = []
        animal_definitions = []

        for index in range(4):
            animal_definitions.append(
                {
                    "numeroCaravana": f"10{index + 1:02d}",
                    "numero_lote": lots["toros"].numero,
                    "tipos": "Toro",
                    "peso": round(640 + (index * 18.5), 1),
                    "edad": round(3.8 + (index * 0.6), 1),
                    "preniada": False,
                    "reciennacida": False,
                    "estado": "vivo",
                }
            )

        for index in range(45):
            if index < 6:
                estado = "vendido"
            elif index < 10:
                estado = "murio"
            else:
                estado = "vivo"

            animal_definitions.append(
                {
                    "numeroCaravana": f"20{index + 1:02d}",
                    "numero_lote": lots["vacas_venta"].numero,
                    "tipos": "Vaca",
                    "peso": round(430 + ((index * 7) % 120), 1),
                    "edad": round(3.5 + ((index * 0.2) % 5.5), 1),
                    "preniada": False,
                    "reciennacida": False,
                    "estado": estado,
                }
            )

        for index in range(40):
            animal_definitions.append(
                {
                    "numeroCaravana": f"30{index + 1:02d}",
                    "numero_lote": lots["vacas_cria"].numero,
                    "tipos": "Vaca",
                    "peso": round(320 + ((index * 6) % 170), 1),
                    "edad": round(0.4 + ((index * 0.18) % 6.2), 1),
                    "preniada": index < 12,
                    "reciennacida": 12 <= index < 20,
                    "estado": "vivo",
                }
            )

        for animal_data in animal_definitions:
            animals.append(Animal.objects.create(userId=user.id, **animal_data))

        return animals

    def _attach_animals_to_lots(self, lots, animals):
        for lot in lots.values():
            lot_animals = [animal for animal in animals if animal.numero_lote == lot.numero]
            lot.animales.set(lot_animals)

    def _create_related_records(self, user):
        today = date.today()
        treatments = [
            ("2001", "Desparasitación estratégica", "Ivermectina", today - timedelta(days=18), 21, 84),
            ("2008", "Refuerzo vitamínico", "Complejo ADE", today - timedelta(days=12), 30, 90),
            ("2016", "Control sanitario pre-venta", "Minerales", today - timedelta(days=8), 15, 45),
            ("3001", "Suplementación posparto", "Sales minerales", today - timedelta(days=6), 20, 60),
            ("3007", "Plan sanitario inicial", "Vitaminas", today - timedelta(days=4), 30, 90),
            ("3015", "Manejo reproductivo", "Suplemento energético", today + timedelta(days=3), 15, 60),
            ("3022", "Revisión general", "Complejo vitamínico", today + timedelta(days=10), 30, 60),
            ("3030", "Refuerzo nutricional", "Proteico", today + timedelta(days=16), 20, 80),
        ]

        for numero_caravana, tratamiento, medicacion, fecha_inicio, cada, durante in treatments:
            Tratamiento.objects.create(
                numeroCaravana=numero_caravana,
                tratamiento=tratamiento,
                medicacion=medicacion,
                fechaInicio=fecha_inicio,
                cada=cada,
                durante=durante,
                userId=user.id,
            )

        sangrados = [
            (2, "2001", 11, today - timedelta(days=14)),
            (2, "2010", 12, today - timedelta(days=5)),
            (3, "3005", 21, today + timedelta(days=2)),
            (3, "3018", 22, today + timedelta(days=11)),
            (3, "3032", 23, today + timedelta(days=19)),
        ]

        for numero_lote, numero_caravana, numero_tubo, fecha in sangrados:
            Sangrado.objects.create(
                numero_lote=numero_lote,
                numeroCaravana=numero_caravana,
                numero_tubo=numero_tubo,
                fecha=fecha,
                userId=user.id,
            )

        tactos = [
            (3, "3001", True, today - timedelta(days=9)),
            (3, "3004", True, today - timedelta(days=1)),
            (3, "3009", True, today + timedelta(days=6)),
            (3, "3012", False, today + timedelta(days=13)),
            (3, "3019", True, today + timedelta(days=20)),
            (3, "3024", False, today + timedelta(days=28)),
        ]

        for numero_lote, numero_caravana, prenada, fecha in tactos:
            Tacto.objects.create(
                numero_lote=numero_lote,
                numeroCaravana=numero_caravana,
                prenada=prenada,
                fecha=fecha,
                userId=user.id,
            )

        vacunaciones = [
            ("2", "Brucelosis", today - timedelta(days=11), 1, 180),
            ("2", "Carbunclo", today + timedelta(days=4), 1, 365),
            ("3", "Clostridial", today - timedelta(days=2), 1, 180),
            ("3", "Complejo respiratorio", today + timedelta(days=9), 2, 30),
            ("1", "Refuerzo reproductivo", today + timedelta(days=15), 1, 120),
        ]

        for numero_lote, nombre_vacuna, fecha_inicio, durante, cada in vacunaciones:
            Vacunacion.objects.create(
                numero_lote=numero_lote,
                nombre_vacuna=nombre_vacuna,
                fechaInicio=fecha_inicio,
                durante=durante,
                cada=cada,
                userId=user.id,
            )

        notifications = [
            ("Lote", "Se regeneraron los lotes demo del usuario mock.", today - timedelta(days=20)),
            ("Estadísticas", "El lote Vacas Venta ya tiene 45 vacas registradas.", today - timedelta(days=15)),
            ("Tratamiento", "Desparasitación estratégica de caravana 2001.", today - timedelta(days=18)),
            ("Sangrado", "Sangrado del lote Vacas Venta.", today - timedelta(days=5)),
            ("Tacto", "Tacto positivo confirmado para la caravana 3001.", today - timedelta(days=1)),
            ("Vacunación", "Vacunación contra Carbunclo para Vacas Venta.", today + timedelta(days=4)),
            ("Tratamiento", "Manejo reproductivo programado para caravana 3015.", today + timedelta(days=3)),
            ("Tacto", "Tacto programado para la caravana 3009.", today + timedelta(days=6)),
            ("Vacunación", "Complejo respiratorio para Vacas Cria.", today + timedelta(days=9)),
            ("Sangrado", "Sangrado previsto para el lote Vacas Cria.", today + timedelta(days=11)),
            ("Tacto", "Revisión de preñez para la caravana 3012.", today + timedelta(days=13)),
            ("Vacunación", "Refuerzo reproductivo para el lote de Toros.", today + timedelta(days=15)),
            ("Tratamiento", "Refuerzo nutricional de caravana 3030.", today + timedelta(days=16)),
            ("Sangrado", "Nuevo sangrado de control para el lote Vacas Cria.", today + timedelta(days=19)),
            ("Tacto", "Chequeo final de preñez para caravana 3019.", today + timedelta(days=20)),
            ("Estadísticas", "Hay vacas preñadas y recién nacidas para probar filtros.", today + timedelta(days=22)),
        ]

        for notification_type, message, notification_date in notifications:
            Notificacion.objects.create(
                userId=user.id,
                tipo=notification_type,
                mensaje=message,
                fecha=timezone.make_aware(
                    timezone.datetime.combine(notification_date, timezone.datetime.min.time())
                ),
            )
