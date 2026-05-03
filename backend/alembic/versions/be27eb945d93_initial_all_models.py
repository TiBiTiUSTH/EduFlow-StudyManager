"""initial_all_models

Revision ID: be27eb945d93
Revises: 
Create Date: 2026-04-09 21:37:07.422072

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# Định danh revision, dùng bởi Alembic.
revision: str = 'be27eb945d93'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### Lệnh được tạo tự động bởi Alembic ###
    op.create_table('subject_channels',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('subject_name', sa.String(length=100), nullable=False),
    sa.Column('grade_level', sa.String(length=20), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('icon', sa.String(length=10), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('member_count', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_subject_channels_id'), 'subject_channels', ['id'], unique=False)
    op.create_table('buddy_relationships',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('buddy_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['buddy_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_buddy_relationships_id'), 'buddy_relationships', ['id'], unique=False)
    op.create_table('buddy_requests',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('sender_id', sa.Integer(), nullable=False),
    sa.Column('receiver_id', sa.Integer(), nullable=False),
    sa.Column('message', sa.Text(), nullable=True),
    sa.Column('status', sa.String(length=20), nullable=True),
    sa.Column('responded_at', sa.DateTime(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['receiver_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['sender_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_buddy_requests_id'), 'buddy_requests', ['id'], unique=False)
    op.create_table('direct_messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('sender_id', sa.Integer(), nullable=False),
    sa.Column('receiver_id', sa.Integer(), nullable=False),
    sa.Column('message', sa.Text(), nullable=False),
    sa.Column('message_type', sa.String(length=20), nullable=True),
    sa.Column('is_read', sa.Boolean(), nullable=True),
    sa.Column('read_at', sa.DateTime(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['receiver_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['sender_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_direct_messages_id'), 'direct_messages', ['id'], unique=False)
    op.create_table('resources',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('subject_name', sa.String(length=100), nullable=True),
    sa.Column('grade_level', sa.String(length=20), nullable=True),
    sa.Column('file_name', sa.String(length=255), nullable=False),
    sa.Column('file_url', sa.String(length=500), nullable=False),
    sa.Column('file_type', sa.String(length=50), nullable=True),
    sa.Column('file_size', sa.Integer(), nullable=True),
    sa.Column('download_count', sa.Integer(), nullable=True),
    sa.Column('is_public', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_resources_id'), 'resources', ['id'], unique=False)
    op.create_table('study_rooms',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('room_code', sa.String(length=10), nullable=False),
    sa.Column('name', sa.String(length=200), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('subject_name', sa.String(length=100), nullable=True),
    sa.Column('host_id', sa.Integer(), nullable=False),
    sa.Column('max_participants', sa.Integer(), nullable=True),
    sa.Column('is_public', sa.Boolean(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['host_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_study_rooms_id'), 'study_rooms', ['id'], unique=False)
    op.create_index(op.f('ix_study_rooms_room_code'), 'study_rooms', ['room_code'], unique=True)
    op.create_table('subject_channel_members',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('channel_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('joined_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['channel_id'], ['subject_channels.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_subject_channel_members_id'), 'subject_channel_members', ['id'], unique=False)
    op.create_table('subject_channel_messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('channel_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('message', sa.Text(), nullable=False),
    sa.Column('message_type', sa.String(length=20), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['channel_id'], ['subject_channels.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_subject_channel_messages_id'), 'subject_channel_messages', ['id'], unique=False)
    op.create_table('study_room_members',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('room_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('role', sa.String(length=20), nullable=True),
    sa.Column('is_online', sa.Boolean(), nullable=True),
    sa.Column('joined_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['room_id'], ['study_rooms.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_study_room_members_id'), 'study_room_members', ['id'], unique=False)
    op.create_table('study_room_messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('room_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('message', sa.Text(), nullable=False),
    sa.Column('message_type', sa.String(length=20), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['room_id'], ['study_rooms.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_study_room_messages_id'), 'study_room_messages', ['id'], unique=False)
    op.create_index(op.f('ix_task_groups_id'), 'task_groups', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_task_groups_id'), table_name='task_groups')
    op.drop_index(op.f('ix_study_room_messages_id'), table_name='study_room_messages')
    op.drop_table('study_room_messages')
    op.drop_index(op.f('ix_study_room_members_id'), table_name='study_room_members')
    op.drop_table('study_room_members')
    op.drop_index(op.f('ix_subject_channel_messages_id'), table_name='subject_channel_messages')
    op.drop_table('subject_channel_messages')
    op.drop_index(op.f('ix_subject_channel_members_id'), table_name='subject_channel_members')
    op.drop_table('subject_channel_members')
    op.drop_index(op.f('ix_study_rooms_room_code'), table_name='study_rooms')
    op.drop_index(op.f('ix_study_rooms_id'), table_name='study_rooms')
    op.drop_table('study_rooms')
    op.drop_index(op.f('ix_resources_id'), table_name='resources')
    op.drop_table('resources')
    op.drop_index(op.f('ix_direct_messages_id'), table_name='direct_messages')
    op.drop_table('direct_messages')
    op.drop_index(op.f('ix_buddy_requests_id'), table_name='buddy_requests')
    op.drop_table('buddy_requests')
    op.drop_index(op.f('ix_buddy_relationships_id'), table_name='buddy_relationships')
    op.drop_table('buddy_relationships')
    op.drop_index(op.f('ix_subject_channels_id'), table_name='subject_channels')
    op.drop_table('subject_channels')