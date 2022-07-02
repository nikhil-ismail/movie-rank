import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase-config";
import { Text, Flex, Heading, Spinner, Circle } from "@chakra-ui/react";
import MyList from "../MyList/MyList";

const Favourites = () => {

  const [movieFavs, setMovieFavs] = useState([]);
  const [tvFavs, setTvFavs] = useState([]);
  const [movieWatch, setMovieWatch] = useState([]);
  const [tvWatch, setTvWatch] = useState([]);
  const [update, setUpdate] = useState(false);
  const [favLoading, setFavLoading] = useState(true);
  const [watchLoading, setWatchLoading] = useState(true);
  const [me, setMe] = useState({});

  const userEmail = auth.currentUser.email;
  let userInitials = me.name && me.name.split(" ")[0][0] + me.name.split(" ")[1][0];
  const usersCollectionRef = collection(db, "users");

  const getFavourites = async () => {
    try {
      const q = query(collection(db, "favourites"), where("email", "==", userEmail));
      const data = await getDocs(q);
      const favourites = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setMovieFavs(favourites.filter(item => item.movie.type === "movie"));
      setTvFavs(favourites.filter(item => item.movie.type === "series"));
      setFavLoading(false);
    }
    catch(err) {
      console.log(err);
    }
  };

  const getWatchList = async () => {
    try {
      const q = query(collection(db, "watch-list"), where("email", "==", userEmail));
      const data = await getDocs(q);
      const watchList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setMovieWatch(watchList.filter(item => item.movie.type === "movie"));
      setTvWatch(watchList.filter(item => item.movie.type === "series"));
      setWatchLoading(false);
    }
    catch(err) {
      console.log(err);
    }
  };

  const getMe = async () => {
    try {
      const data = await getDocs(usersCollectionRef);
      const toAdd = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const profile = toAdd.filter(user => user.email === userEmail);
      setMe(profile[0]);
      userInitials = profile[0].name.split(" ")[0][0] + profile[0].name.split(" ")[1][0];
    }
    catch(err) {
      console.log(err);
    }
  };

  const handleUpdate = () => {
    setUpdate(!update);
  }

  useEffect(() => {
    getFavourites();
    getWatchList();
    getMe();
  }, [update]);

  return (
    <Flex flexDirection="row">
      <Flex flexDirection="column">
        <Heading fontSize="26px" mb="25px" ml="20px">My Profile</Heading>
        <Flex borderRadius="10px" padding="25px" marginLeft="20px" backgroundColor="lightgray" flexDirection="column">
            <Flex mb="10px" borderRadius="10px" padding="25px" backgroundColor="white" flexDirection="column">
              <Circle size='40px' bg='red' color='white'>{userInitials}</Circle>
              <Text>{me.name}</Text>
              <Text>{me.genres}</Text>
              <Text>{me.actors}</Text>
            </Flex>
        </Flex>
      </Flex>
      <Flex flexDirection="column">
        <Heading fontSize="26px" mb="25px" ml="150px">Favourites</Heading>
        <Flex borderRadius="10px" padding="25px" marginLeft="40px" backgroundColor="lightgray" flexDirection="column">
          <Heading fontSize="24px" mb="25px">Movies</Heading>
          {favLoading ? <Spinner justifyContent="center" alignItems="center" /> : movieFavs.length === 0 ? (
            <Text mb="25px">You have not liked any movies yet!</Text>
          ) : 
            (
            movieFavs.map((favourite, index) => {
              return (
                  <MyList handleUpdate={handleUpdate} key={index} movie={favourite} />
              )
            })
          )}
          <Heading fontSize="24px" mb="25px">TV Shows</Heading>
          {favLoading ? <Spinner justifyContent="center" alignItems="center" /> : tvFavs.length === 0 ? (
            <Text mb="25px">You have not liked any tv shows yet!</Text>
          ) : 
            (
            tvFavs.map((favourite, index) => {
              return (
                  <MyList handleUpdate={handleUpdate} key={index} movie={favourite} />
              )
            })
          )}
        </Flex>
      </Flex>
      <Flex flexDirection="column">
        <Heading fontSize="26px" mb="25px" ml="150px">My Watch List</Heading>
        <Flex borderRadius="10px" padding="25px" marginLeft="60px" backgroundColor="lightgray" flexDirection="column">
          <Heading fontSize="24px" mb="25px">Movies</Heading>
          {watchLoading ? <Spinner justifyContent="center" alignItems="center" /> : movieWatch.length === 0 ? (
            <Text mb="25px">You have not added any movies to your watch list yet!</Text>
          ) : (
            movieWatch.map((watch, index) => {
              return (
                <MyList handleUpdate={handleUpdate} key={index} movie={watch} />
              )
            })
          )}
          <Heading fontSize="24px" mb="25px">TV Shows</Heading>
          {watchLoading ? <Spinner justifyContent="center" alignItems="center" /> : tvWatch.length === 0 ? (
            <Text mb="25px">You have not added any tv shows to your watch list yet!</Text>
          ) : (
            tvWatch.map((watch, index) => {
              return (
                <MyList handleUpdate={handleUpdate} key={index} movie={watch} />
              )
            })
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Favourites;
