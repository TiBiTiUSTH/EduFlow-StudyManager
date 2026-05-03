from logging.config import fileConfig
import os
import sys

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from dotenv import load_dotenv

from alembic import context

# Tải .env từ thư mục backend
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

# Thêm thư mục cha vào path để import module app
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Đối tượng cấu hình Alembic
config = context.config

# Lấy sqlalchemy.url từ biến môi trường
database_url = os.getenv(
    "DATABASE_URL",
    "postgresql://eduflow_user:eduflow_pass@127.0.0.1:5433/eduflow_db"
)
config.set_main_option("sqlalchemy.url", database_url)

# Cấu hình logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import models để Alembic nhận diện
from app.database import Base
from app.models.models import * 

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
