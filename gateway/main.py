import serial
import httpx
import time
import json
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [gateway] %(message)s")
log = logging.getLogger(__name__)

PUERTO_SERIAL = "COM3"
BAUD_RATE = 115200
BACKEND_URL = "http://localhost:8000"
POLL_INTERVALO = 1

ser = serial.Serial(PUERTO_SERIAL, BAUD_RATE, timeout=1)
time.sleep(2)

ventana_abierta_actual = None
ultimo_poll = 0


def post_telemetria(data: dict):
    try:
        r = httpx.post(f"{BACKEND_URL}/telemetria", json=data, timeout=5)
        r.raise_for_status()
    except Exception as e:
        log.error(f"Error enviando telemetría: {e}")


def poll_ventana():
    global ventana_abierta_actual
    try:
        r = httpx.get(f"{BACKEND_URL}/actuador/ventana", timeout=5)
        r.raise_for_status()
        data = r.json()
        estado_remoto = data["ventana_abierta"]

        if estado_remoto != ventana_abierta_actual:
            comando = "abrir" if estado_remoto else "cerrar"
            ser.write((json.dumps({"comando": comando}) + "\n").encode())
            ventana_abierta_actual = estado_remoto
            log.info(f"Ventana cambió a {comando} — comando enviado al ESP32")
    except Exception as e:
        log.error(f"Error polling ventana: {e}")


while True:
    line = ser.readline().decode("utf-8", errors="ignore").strip()

    if line:
        try:
            data = json.loads(line)
        except json.JSONDecodeError:
            log.warning(f"Línea no JSON: {line!r}")
            continue

        if "error" in data:
            log.warning(f"Error del ESP32: {data['error']}")
        elif "status" in data:
            log.info(f"Estado ESP32: {data['status']}")
        elif "temperatura" in data and "humedad" in data:
            post_telemetria(data)

    ahora = time.time()
    if ahora - ultimo_poll >= POLL_INTERVALO:
        poll_ventana()
        ultimo_poll = ahora
