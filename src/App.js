import "./App.css";
import React from "react";

const Item = ({ item, onRemoveItem }) => {
  return (
    <li key={item.objectId}>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button
          type="button"
          onClick={() => {
            onRemoveItem(item);
          }}
        >
          Dismiss
        </button>
      </span>
    </li>
  );
};

const List = ({ list, onRemoveItem }) => {
  return (
    <ul>
      {list.map((item) => {
        return (
          <Item key={item.objectId} item={item} onRemoveItem={onRemoveItem} />
        );
      })}
    </ul>
  );
};

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  isFocused,
  children,
}) => {
  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        id={id}
        type={type}
        autoFocus
        value={value}
        onChange={onInputChange}
      />
      <p>
        Searching for <strong>{value}</strong>
      </p>
    </>
  );
};

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

/*
  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem("search") || "React"
  );

  //ensures that if searchTerm is used in multiple locations, it's updated outside of a specific function
  //useEffect takes in a side effect and dependencies of that sideEffect
  React.useEffect(() => {
    localStorage.setItem("search", searchTerm);
  }, [searchTerm]);

*/

const App = () => {
  const initialStories = [
    {
      title: "React",
      url: "https://reactjs.org",
      author: "Zac Garland",
      num_comments: 3,
      points: 4,
      objectId: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org",
      author: "Zac Garland",
      num_comments: 2,
      points: 5,
      objectId: 1,
    },
  ];

  const storiesReducer = (state, action) => {
    switch (action.type) {
      case "STORIES_FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case "STORIES_FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case "STORIES_FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      case "REMOVE_STORY":
        return {
          ...state,
          data: state.data.filter(
            (story) => action.payload.objectId !== story.objectId
          ),
        };
      default:
        throw new Error();
    }
  };

  const getAsyncStories = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { stories: initialStories } });
      }, 2000);
    });
  };

  const [searchTerm, setSearchTerm] = useStorageState("search", "");
  // const [stories, setStories] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  React.useEffect(() => {
if(!searchTerm) return;

    dispatchStories({ type: "STORIES_FETCH_INIT" });

    fetch(`${API_ENDPOINT}${searchTerm}`)
      .then((response) => response.json())
      .then((result) => {
        dispatchStories({
          type: "STORIES_FETCH_SUCCESS",
          payload: result.hits,
        });
      })
      .catch(() => dispatchStories({ type: "STORIES_FETCH_FAILURE" }));
  }, [searchTerm]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });

    //    setStories(newStories);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.data.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <h1>Hacker News</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />
      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading....</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </>
  );
};

/*
      <Search search={searchTerm} onSearch = {handleSearch}></Search>

*/

export default App;

/*
  const Search = ({ search, onSearch }) => {
    //object destructuring vs. props.x
  
    return (
      <>
        <label htmlFor="search">Search: </label>
        <input id="search" type="text" value={search} onChange={onSearch}></input>
  
        <p>
          Searching for <strong>{search}</strong>
        </p>
      </>
    );
  };
*/

/*

// spread and rest operators 
// object destructing

const Item = ({ title,url,author,num_comments,points }) => {
  return (
    <li>
      <span>
        <a href={url}>{title}</a>
      </span>
      <span>{author}</span>
      <span>{num_comments}</span>
      <span>{points}</span>
    </li>
  );
};

const List = ({list}) => {
  return (
    <ul>
      {list.map(({objectId,...item}) => {
        return <Item key={objectId} {...item} />;
      })}
    </ul>
  );
};


*/
