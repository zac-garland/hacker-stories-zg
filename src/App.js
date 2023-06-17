import "./App.css";
import React from "react";

const App = () => {
  const stories = [
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

  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem("search") || "React"
  );

  //ensures that if searchTerm is used in multiple locations, it's updated outside of a specific function
  //useEffect takes in a side effect and dependencies of that sideEffect
  React.useEffect(() => {
    localStorage.setItem("search", searchTerm);
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1>Hello world</h1>

      <Search search={searchTerm} onSearch={handleSearch} />
      <hr />
      <List list={searchedStories} />
    </div>
  );
};

const Search = ({ search, onSearch }) => {
  //object destructuring vs. props.x

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" value={search} onChange={onSearch}></input>

      <p>
        Searching for <strong>{search}</strong>
      </p>
    </div>
  );
};

const Item = ({ item }) => {
  return (
    <li key={item.objectId}>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
    </li>
  );
};

const List = ({ list }) => {
  return (
    <ul>
      {list.map((item) => {
        return <Item key={item.objectId} item={item} />;
      })}
    </ul>
  );
};

export default App;

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
