import pickle
import typing
from functools import partial

import pika
from models import Video


class BaseRabbitMQ:
    def __init__(self, queue_name: str, hostname: str = "localhost"):
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(hostname))
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
        self, queue_name: str, callback: typing.Callable[[Video]], auto_ack=True
    ):
        def _wrap_callback(ch, method, properties, body):
            return callback(body)

        self.channel.basic_consume(
            queue=queue_name, on_message_callback=_wrap_callback, auto_ack=auto_ack
        )

    def start_consuming(self, queue_name: str, callback: typing.Callable[[Video]]):
        self._initiate(queue_name=queue_name, callback=callback)
        self.channel.start_consuming()

    def stop_consuming(self):
        self.channel.stop_consuming()
        self.connection.close()


# if __name__ == "__main__":

#     # Establish a connection to the RabbitMQ server
#     connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))

#     # Create a channel
#     channel = connection.channel()

#     # Create a queue named 'my_queue'
#     channel.queue_declare(queue="my_queue")

#     for video in videos:
#         # Serialize the object using pickle
#         message = pickle.dumps(video)

#         # Publish the message to the queue
#         channel.basic_publish(exchange="", routing_key="my_queue", body=message)

#     # Close the connection
#     connection.close()
