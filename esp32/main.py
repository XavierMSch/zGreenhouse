import machine
import dht
import time
import json
import select
import sys

DHT_PIN = 15
SG90_PIN = 13
INTERVALO_LECTURA = 10
INTERVALO_POLL_COMANDOS = 0.1

sensor = dht.DHT22(machine.Pin(DHT_PIN))
servo = machine.PWM(machine.Pin(SG90_PIN), freq=50)


def set_ventana(abierta: bool):
    if abierta:
        duty = 55
    else:
        duty = 26
    servo.duty(duty)


def send(obj):
    print(json.dumps(obj))


send({"status": "listo"})

ultima_lectura = 0

while True:
    ahora = time.time()

    if ahora - ultima_lectura >= INTERVALO_LECTURA:
        try:
            sensor.measure()
            send({"temperatura": sensor.temperature(), "humedad": sensor.humidity()})
        except Exception as e:
            send({"error": str(e)})
        ultima_lectura = ahora

    while select.select([sys.stdin], [], [], 0)[0]:
        linea = sys.stdin.readline().strip()
        if not linea:
            continue
        try:
            cmd = json.loads(linea)
        except json.JSONDecodeError:
            continue

        if cmd.get("comando") == "abrir":
            set_ventana(True)
        elif cmd.get("comando") == "cerrar":
            set_ventana(False)

    time.sleep(INTERVALO_POLL_COMANDOS)
