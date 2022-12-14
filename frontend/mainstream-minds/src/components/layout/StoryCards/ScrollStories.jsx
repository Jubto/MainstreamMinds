import { useRef } from "react"
import { CardCarouselStyle, Scroll, NextIcon, cardSize, BackIcon, Subtitle } from "./CardStyles"
import Card from "../../layout/StoryCards/Card";
import IconButton from '@mui/material/IconButton';

const ScrollStories = (props) => {
  const story = props.story
  const componentRef = useRef(null)
  const emptyText = props.emptyText

  const scroll = (scrollOffset) => {
    componentRef.current.scrollLeft += scrollOffset;
  };

  

  return (
    <Scroll>
      {(story && story.length > 0) && <IconButton sx={{borderRadius: '4px'}} onClick={() => scroll(-cardSize*3)}>
        <BackIcon/>
      </IconButton>}
      <CardCarouselStyle ref={componentRef}>
        {(story && story.length) ? Object.entries(story).map(([key, value], idx) => {
          return (
            <Card 
              key={idx} 
              title={value.title} 
              tags={value.tags}
              researcher={value.researchers[0]}
              storyId={value.id}
              showLikes={props.showLikes}
              thumbnail={value.thumbnail}
            />
        )}, this) : <Subtitle>No stories to show. {emptyText}</Subtitle>
        }
        
      </CardCarouselStyle>
      {(story && story.length > 0) && <IconButton sx={{borderRadius: '4px'}} onClick={() => scroll(cardSize*3)}>
        <NextIcon/>
        </IconButton>}
    </Scroll>
  );
}

export default ScrollStories;
