from app.models.user import UserCreate
from app.routers import researcher
from fastapi import APIRouter, Depends, Path
import requests
import json


from app.core.security import get_request_user_id, is_consumer, is_researcher
from app.models.institution import InstitutionRead, InstitutionCreate, InstitutionUpdate
from app.models.pagination import Page, Paginator, get_paginator
from app.models.researcher import Researcher, ResearcherCreate
from app.models.research_story import ResearchStoryCreate
from app.services.institution import InstitutionService
from app.services.researcher import ResearcherService
from app.services.user import UserService


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
        paginator: Paginator = Depends(get_paginator),
):
    # populate_universities(n, institution_service)
    populate_researchers(n, user_service, researcher_service, paginator)
    # populate_service.populate_research_stories()
    
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
        paginator: Paginator = Depends(get_paginator),
    ):
        
        # file_path = '/mnt/c/Users/HCharak/OneDrive/Documents/UNSW-DESKTOP-UK70UPK/COMP9323/research-stories/backend/app/data/users.json'
        # with open(file_path) as json_file:
        #     user_data = json.load(json_file)
        #     for user in user_data:
        #         user_obj = UserCreate(first_name = user['first_name'], 
        #                               last_name = user['last_name'], 
        #                               email = user['email'], 
        #                               password = user['password']) 
        #         user_service.create_user(user_obj)

        # file_path = '/mnt/c/Users/HCharak/OneDrive/Documents/UNSW-DESKTOP-UK70UPK/COMP9323/research-stories/backend/app/data/researchers.json'
        
        
        # researcher_info = ResearcherCreate(bio = user['bio'],
        #                                    institution = user['institution'])

        # researcher_id = researcher_service.upgrade(researcher_info, id)
        print(get_users(paginator, user_service))


        return f'added {n} new researchers'


def get_users(
    paginator: Paginator = Depends(get_paginator),
    user_service: UserService = Depends(UserService)
    ):
    return user_service.get_all(paginator)