from typing import List

from app.settings import get_settings
from app.db import redis_handle

CACHE_SIZE = get_settings().CACHE_SIZE


# at worst: O(logN), where N is the number of stories in the db
def update_trending(story_id: int):
    with redis_handle.pipeline() as p:
        # push the story_id to the top of the cache for the last CACHE_SIZE stories requested
        p.lpush("queue", story_id)
        # increment the count of this story_id in the cache
        p.zincrby("counter", 1, story_id)
        # grab the stories at the bottom of the cache we are about to chop off
        p.lrange("queue", CACHE_SIZE, -1)
        # chop them off
        p.ltrim("queue", 0, CACHE_SIZE - 1)
        res = p.execute()  # executes commands and clears pipeline
        for removed_id in res[2]:
            # decrement the count of the removed stories
            p.zincrby("counter", -1, removed_id)
        p.execute()


# at worst: O(logN + top_n), where N is the number of stories in the db
def get_trending(page: int, page_size: int) -> List[int]:
    return list(map(lambda x: int(x.decode("utf-8")), redis_handle.zrange("counter", page*page_size, page_size, True)))


def get_cache_len() -> int:
    # this is going to include stories that were trending at one point but now have counter value 0... which is fine ig
    return redis_handle.zcard("counter")
