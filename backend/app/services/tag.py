from typing import List, Optional

from fastapi import Depends

from app.models.pagination import Page, Paginator
from app.models.tag import Tag, TagRead, TagCreate
from app.repositories.tag import TagRepository, get_tag_repository
from app.utils.exceptions import TagAlreadyExistsHttpException, NonExistentEntry


class TagService:

    def __init__(self, tag_repository: TagRepository = Depends(get_tag_repository)):
        self.repository = tag_repository

    def get_preference_tags(self, current_user_id: int) -> List[Tag]:
        return self.repository.get_preference_tags(current_user_id)

    def add_preference_tag(self, current_user_id: int, tag: str):
        if not self.repository.get_tag_by_name(tag):
            raise NonExistentEntry('Tag.name', tag)
        self.repository.add_preference_tag(current_user_id, tag)

    def remove_preference_tag(self, current_user_id: int, tag: str):
        if not self.repository.get_tag_by_name(tag):
            raise NonExistentEntry('Tag.name', tag)
        current_user_preference_tag_names = [t.name for t in self.repository.get_preference_tags(current_user_id)]
        if tag not in current_user_preference_tag_names:
            raise NonExistentEntry('Tag.name', tag)
        self.repository.remove_preference_tag(current_user_id, tag)

    def create_tag(self, tag: TagCreate):
        if self.repository.get_tag_by_name(tag.name):
            raise TagAlreadyExistsHttpException()
        return self.repository.create_tag(tag)

    def get_tags(self, paginator: Paginator) -> Page[TagRead]:
        return self.repository.get_tags(paginator)

    def get_tag_by_name(self, name: str) -> Optional[Tag]:
        return self.repository.get_tag_by_name(name)
