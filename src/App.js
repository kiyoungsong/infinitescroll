import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import { getMovies } from "./api";
import { useIntersectionObserver } from "./useIntersectionObserver";

function App() {
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  const firstMovie = async () => {
    try {
      setLoading(true);
      const {
        data: {
          data: { movies, page_number }
        }
      } = await getMovies();
      setData(movies);
      setPage(page_number);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getMovie = async (idx) => {
    const {
      data: {
        data: { movies, page_number }
      }
    } = await getMovies(idx);
    const temp = [...data, ...movies];
    var non_duplidated_data = _.uniq(temp, "title");
    setData(non_duplidated_data);
    setPage(page_number);
  };

  useEffect(() => {
    firstMovie();
  }, []);

  useIntersectionObserver({
    target,
    onIntersect: ([{ isIntersecting }]) => {
      if (isIntersecting) {
        !loading && getMovie(page + 1);
      }
    }
  });
  return (
    <div className="App">
      <h1>Infinite Movies / Page {page}</h1>
      <div className="container">
        {data &&
          data.length > 0 &&
          data.map((value) => <h3 key={value.id}>{value.title}</h3>)}
        {loading && "loading"}
        <div ref={setTarget} />
      </div>
    </div>
  );
}

export default App;
