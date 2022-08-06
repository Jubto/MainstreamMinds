from fastapi import APIRouter, Depends, Path
import requests
import json

from app.core.security import get_request_user_id, is_consumer, is_researcher
from app.models.institution import InstitutionRead, InstitutionCreate, InstitutionUpdate
from app.models.pagination import Page, Paginator, get_paginator
from app.services.institution import InstitutionService
from app.models.researcher import Researcher
from app.models.research_story import ResearchStoryShortRead
from app.services.institution import InstitutionService


router = APIRouter(tags=['populate'])

@router.post(
    "/", 
    description='populates database',
    # dependencies=[Depends(is_researcher)] 
)
async def populate_universities(
        n: int,
        institution_service: InstitutionService = Depends(InstitutionService),
):
    
    logo = 'https://www.universitiesaustralia.edu.au/wp-content/themes/universities-australia/img/ua-logo-white.png'
    inst = InstitutionCreate(name='newUni', location='Sydney', year_established=2020, logo=logo) 
    r = institution_service.create_institution(inst)


    return f'added {n} new stories: {r}'

@router.post(
    "/", 
    description='populates database',
    # dependencies=[Depends(is_researcher)] 
)
async def populate_researchers(
        n: int,
        institution_service: InstitutionService = Depends(InstitutionService),
):
    
    logo = 'https://www.universitiesaustralia.edu.au/wp-content/themes/universities-australia/img/ua-logo-white.png'
    inst = InstitutionCreate(name='newUni', location='Sydney', year_established=2020, logo=logo) 
    r = institution_service.create_institution(inst)


    return f'added {n} new stories: {r}'

@router.post(
    "/", 
    description='populates database',
    # dependencies=[Depends(is_researcher)] 
)
async def populate_research_stories(
        n: int,
        institution_service: InstitutionService = Depends(InstitutionService),
):
    
    logo = 'https://www.universitiesaustralia.edu.au/wp-content/themes/universities-australia/img/ua-logo-white.png'
    inst = InstitutionCreate(name='newUni', location='Sydney', year_established=2020, logo=logo) 
    r = institution_service.create_institution(inst)


    return f'added {n} new stories: {r}'