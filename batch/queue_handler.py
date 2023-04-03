import pickle
import typing

import pika
from models import Video


class BaseRabbitMQ:
    def __init__(self, queue_name: str, hostname: str = "localhost"):
        self.connection = pika.BlockingConnection(
            # setting the heartbeat to 0 disables heartbeat checking
            # between the client and the rmq server. this is needed
            # because the transcription takes longer than the broker's
            # default 60 sec timeout, and causes errors.
            pika.ConnectionParameters(hostname, heartbeat=0)
        )
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue_name)

    def close(self):
        self.connection.close()


class VideoQueueHandler(BaseRabbitMQ):
    def publish(self, data: typing.Any, exchange: str, routing_key: str):
        message = pickle.dumps(data)
        self.channel.basic_publish(
            exchange=exchange, routing_key=routing_key, body=message
        )


class VideoQueueConsumer(BaseRabbitMQ):
    def _initiate(
        self, queue_name: str, callback: typing.Callable[[Video], None], auto_ack=True
    ):
        def _wrap_callback(ch, method, properties, body):
            return callback(body)

        self.channel.basic_consume(
            queue=queue_name, on_message_callback=_wrap_callback, auto_ack=auto_ack
        )

    def start_consuming(
        self, queue_name: str, callback: typing.Callable[[Video], None]
    ):
        self._initiate(queue_name=queue_name, callback=callback)
        self.channel.start_consuming()

    def stop_consuming(self):
        self.channel.stop_consuming()
        self.connection.close()
