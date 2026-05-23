import machine
import dht
import time
import json
import sys

DHT_PIN = 15

INTERVALO_LECTURA = 10

sensor = dht.DHT22(machine.Pin(DHT_PIN))

def send(obj):
    print(json.dumps(obj))


send({"status": "listo"})

while True:
    try:
        sensor.measure()
        send({
            "temperatura": sensor.temperature(),
            "humedad": sensor.humidity()
        })
    except Exception as e:
        send({"error": str(e)})

    time.sleep(INTERVALO_LECTURA)
