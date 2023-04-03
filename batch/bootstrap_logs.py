import logging


def setup_logging(logger_name, log_file_path):
    """Logging setup to write to a logfile"""
    logger = logging.getLogger(logger_name)
    handler = logging.FileHandler(log_file_path)
    formatter = logging.Formatter("%(asctime)s %(levelname)s - %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger
