from typing import List, Optional

from fastapi import Depends

from app.models.pagination import Page, Paginator
from app.models.tag import Tag, TagRW
from app.repositories.tag import TagRepository, get_tag_repository


class TagService:

    def __init__(self, tag_repository: TagRepository = Depends(get_tag_repository)):
        self.repository = tag_repository

    def get_preference_tags(self, current_user_id: int) -> List[Tag]:
        return self.repository.get_preference_tags(current_user_id)

    def add_preference_tag(self, current_user_id: int, tag: str):
        self.repository.add_preference_tag(current_user_id, tag)

    def create_tag(self, tag: TagRW):
        self.repository.create_tag(tag)

    def get_tags(self, paginator: Paginator) -> Page[TagRW]:
        return self.repository.get_tags(paginator)

    def get_tag_by_name(self, name: str) -> Optional[Tag]:
        return self.repository.get_tag_by_name(name)
