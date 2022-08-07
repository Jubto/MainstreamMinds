from app.models.user import UserCreate
from app.routers import researcher
from fastapi import APIRouter, Depends, Path
import requests
import json
import random

from app.core.security import get_request_user_id, is_consumer, is_researcher
from app.models.institution import InstitutionRead, InstitutionCreate, InstitutionUpdate
from app.models.pagination import Page, Paginator, get_paginator
from app.models.researcher import Researcher, ResearcherCreate
from app.models.research_story import ResearchStoryCreate
from app.models.tag import TagCreate
from app.services.institution import InstitutionService
from app.services.researcher import ResearcherService
from app.services.user import UserService
from app.services.research_story import ResearchStoryService
from app.services.tag import TagService


router = APIRouter(tags=['populate'])

@router.post(
    "/", 
    description='populates database',
    # dependencies=[Depends(is_researcher)] 
)
async def populate_universities(
        n: int,
        institution_service: InstitutionService = Depends(InstitutionService),
        user_service: UserService = Depends(UserService),
        researcher_service: ResearcherService = Depends(ResearcherService),
        story_service: ResearchStoryService = Depends(ResearchStoryService),
        tag_service: TagService = Depends(TagService),
):
    # populate_universities(n, institution_service)
    # populate_researchers(n, user_service, researcher_service)
    populate_research_stories(n, story_service, tag_service)
    
    return f'added {n} new institutions'


def populate_universities(
        n: int, 
        institution_service: InstitutionService = Depends(InstitutionService),
    ):
        # script_dir = os.path.dirname(__file__)
        # file_path = script_dir + 'institutions.json'
        file_path = '/mnt/c/Users/HCharak/OneDrive/Documents/UNSW-DESKTOP-UK70UPK/COMP9323/research-stories/backend/app/data/institutions.json'
        with open(file_path) as json_file:
            uni_data = json.load(json_file)
            for institution in uni_data:
                inst = InstitutionCreate(name=institution['name'], 
                                        location=institution['address'], 
                                        year_established=institution['year_established'], 
                                        logo=institution['logo']) 
                institution_service.create_institution(inst)

        return f'added {n} new institutions'


def populate_researchers(
        n: int,
        user_service: UserService = Depends(UserService),
        researcher_service: ResearcherService = Depends(ResearcherService),
    ):
        
        file_path = '/mnt/c/Users/HCharak/OneDrive/Documents/UNSW-DESKTOP-UK70UPK/COMP9323/research-stories/backend/app/data/user_researcher.json'
        with open(file_path) as json_file:
            user_data = json.load(json_file)
            for user in user_data:
                user_obj = UserCreate(first_name = user['first_name'], 
                                      last_name = user['last_name'], 
                                      email = user['email'], 
                                      password = user['password']) 
                new_user = user_service.create(user_obj)
                print(f"User created with id: {new_user.id}")

                researcher_info = ResearcherCreate(bio = user['bio'],
                                                   institution = user['institution'])

                researcher_id = researcher_service.upgrade(researcher_info, new_user.id)

        return f'added {n} new researchers'


def populate_research_stories(
        n: int,
        story_service: ResearchStoryService = Depends(ResearchStoryService),
        tag_service: TagService = Depends(TagService),
    ):
        
        file_path = '/mnt/c/Users/HCharak/OneDrive/Documents/UNSW-DESKTOP-UK70UPK/COMP9323/research-stories/backend/app/data/research_stories.json'
        with open(file_path) as json_file:
            story_data = json.load(json_file)
            for story in story_data:
                
                tag_ids = generate_tags(tag_service, story['tags'])
                authors = generate_authors()
                
                story_obj = ResearchStoryCreate(title = story['title'], 
                                                summary = story['description'], 
                                                papers = 'https://www.jstor.org/', 
                                                thumbnail = story['thumbnail_link'], 
                                                video_link = 'www.youtube.com/watch?v='+story['video_id'], 
                                                authors = authors, 
                                                institutions = [], 
                                                tags = tag_ids, 
                                                content_body = story['description']) 
                new_user = story_service.create(story_obj)
                print(f"Story created with id: {new_user.id}")

        return f'added {n} new stories'


def generate_tags(tag_service, tag_list):
    clean_tags = [string for string in tag_list.split("|") if ' ' not in string]
    tag_id_list = []
    for tag_name in clean_tags:
        tag = tag_service.get_tag_by_name(tag_name)
        if not tag:
            tag_obj = TagCreate(name = tag_name)
            tag_info = tag_service.create_tag(tag_obj)
            tag_id_list.append(tag_info.id)
    return tag_id_list

def generate_authors():
    # To be used if able to cope with multiple authors
    # num_auth = random.randint(0,3)
    # authors = []
    # for num in range(num_auth):
    #     author = random.randint(0,40)
    #     authors.append(author)
    return [random.randint(1,40)]