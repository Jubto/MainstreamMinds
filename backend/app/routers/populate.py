import json
import pathlib
import random

from fastapi import APIRouter, Depends

from app.models.institution import InstitutionCreate
from app.models.research_story import ResearchStoryCreate
from app.models.researcher import ResearcherCreate
from app.models.tag import TagCreate
from app.models.user import UserCreate
from app.services.institution import InstitutionService
from app.services.research_story import ResearchStoryService
from app.services.researcher import ResearcherService
from app.services.tag import TagService
from app.services.user import UserService

router = APIRouter(tags=['populate'])
base_path = pathlib.Path.cwd() / "app/data"
acceptable_tags = ["science", "psychology", "statistics", "agriculture", "computer",
                   "global", "history", "chemistry", "geography", "research", "lawyer",
                   "journalism", "robotics", "medicine", "engineering", "physiotherapy",
                   "philosophy", "physics", "quantum", "gene", "genome", "disease",
                   "legal", "fertility", "research", "university"]


@router.post(
    "/",
    # dependencies=[Depends(is_researcher)] 
)
async def populate_database(
        n: int,
        institution_service: InstitutionService = Depends(InstitutionService),
        researcher_service: ResearcherService = Depends(ResearcherService),
        story_service: ResearchStoryService = Depends(ResearchStoryService),
        tag_service: TagService = Depends(TagService),
        user_service: UserService = Depends(UserService),
):
    """
    Populate the database (ensure starting with an empty database)
    """
    populate_institutions(institution_service)
    populate_tags(tag_service)
    populate_researchers(institution_service, researcher_service, tag_service, user_service)
    populate_research_stories(n, researcher_service, story_service, tag_service)

    return 'Successfully populated database'


def populate_institutions(
        institution_service: InstitutionService = Depends(InstitutionService),
):
    """
    Populate all institutions in the database using the institutions json file
    """
    file_path = base_path / "institutions.json"
    with open(file_path) as json_file:
        uni_data = json.load(json_file)
        for institution in uni_data:
            inst = InstitutionCreate(name=institution['name'],
                                     location=institution['address'],
                                     year_established=institution['year_established'],
                                     logo=institution['logo'])
            inst_id = institution_service.create_institution(inst)
            print(f"Institution created with id: {inst_id}")


def populate_tags(
        tag_service: TagService = Depends(TagService),
):
    """
    Populate all tags in the database from list of acceptable tags
    """
    for tag_name in acceptable_tags:
        tag = tag_service.get_tag_by_name(tag_name)
        if not tag:
            tag_obj = TagCreate(name=tag_name)
            tag_service.create_tag(tag_obj)
            print(f"Tag created with name: {tag_name}")


def populate_researchers(
        institution_service: InstitutionService = Depends(InstitutionService),
        researcher_service: ResearcherService = Depends(ResearcherService),
        tag_service: TagService = Depends(TagService),
        user_service: UserService = Depends(UserService),
):
    """
    Populate all researchers in the database by creating users and upgrading them to researchers
    """
    file_path = base_path / "user_researcher.json"
    with open(file_path) as json_file:
        user_data = json.load(json_file)
        for user in user_data:
            user_obj = UserCreate(first_name=user['first_name'],
                                  last_name=user['last_name'],
                                  email=user['email'],
                                  password='testpassword')
            new_user = user_service.create(user_obj)
            print(f"User created with id: {new_user.id}")

            inst = user['institution']
            institution = institution_service.get_institution_by_id(inst)
            inst_email = user['first_name'] + user['last_name'] + "@" + institution.name.split(' ')[0] + ".com"
            inst_email = inst_email.lower()
            position = user["position"]

            researcher_info = ResearcherCreate(bio=user['bio'],
                                               institution_id=inst,
                                               institution_email=inst_email,
                                               institution_position=position)

            researcher_service.upgrade(researcher_info, new_user.id)
            add_researcher_preference_tags(tag_service, new_user.id)


def populate_research_stories(
        number_of_stories: int,
        researcher_service: ResearcherService = Depends(ResearcherService),
        story_service: ResearchStoryService = Depends(),
        tag_service: TagService = Depends(TagService),
):
    """
    Populate all research stories in the database using story information from youtube
    There are 188 stories in total, any value of number_of_stories greater than 188 will
    result in all 188 stories being loaded
    """
    file_path = base_path / "research_stories.json"
    with open(file_path) as json_file:
        story_data = json.load(json_file)
        i = 0
        for story in story_data:
            if i >= number_of_stories: break

            authors = generate_authors()
            institution_id_list, institution_names = generate_institutions(researcher_service, authors)
            tag_ids = generate_tags(tag_service, story['tags'], institution_names)

            story_obj = ResearchStoryCreate(title=story['title'],
                                            summary=story['description'],
                                            papers='https://www.jstor.org/',
                                            thumbnail=story['thumbnail_link'],
                                            video_link='www.youtube.com/watch?v=' + story['video_id'],
                                            authors=authors,
                                            institutions=institution_id_list,
                                            tags=tag_ids,
                                            content_body=story['description'])
            new_user = story_service.create(story_obj)
            print(f"Story created with id: {new_user.id}")
            i += 1

    return f'added {number_of_stories} new stories'


def add_researcher_preference_tags(tag_service, current_user_id):
    """
    Assigns 1-3 preference tags for each researcher.
    """
    num_tags = random.randint(1, 3)
    for _ in range(num_tags):
        index = random.randint(0, len(acceptable_tags) - 1)
        tag_service.add_preference_tag(current_user_id, acceptable_tags[index])


def generate_tags(tag_service, tag_list, institution_names):
    """
    Takes a list of tag names and generates an appropriate list of ids.
    If the tag already exists it uses the existing id, if not, creates a tag.
    """

    tag_id_list = []
    for tag_name in tag_list+institution_names:
        tag = tag_service.get_tag_by_name(tag_name)
        if not tag:
            tag_obj = TagCreate(name=tag_name)
            tag_info = tag_service.create_tag(tag_obj)
            tag_id_list.append(tag_info.id)
        else:
            tag_id_list.append(tag.id)
    return tag_id_list


def generate_authors():
    """
    Randomly assigns an author to a research story.
    """
    # To be used if able to cope with multiple authors
    # num_auth = random.randint(0,3)
    # authors = []
    # for num in range(num_auth):
    #     author = random.randint(0,40)
    #     authors.append(author)
    return [random.randint(1, 40)]


def generate_institutions(researcher_service, authors):
    """
    Uses the given authors to collect the associated institutions for a given list of authors.
    """
    institution_ids = []
    institution_names = []
    for author in authors:
        researcher = researcher_service.get_researcher_by_id(author)
        if researcher.institution:
            institution_ids.append(researcher.institution.id)
            institution_names.append(researcher.institution.name)

    return institution_ids, institution_names
