import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchUsers() {
      const result = await axios.get("https://randomuser.me/api/?results=20");
      if (isMounted) {
        setUsers(result.data.results);
      }
    }

    fetchUsers();

    return () => (isMounted = false);
  }, []);

  const flattenObj = (ob) => {
    let result = {};

    for (const i in ob) {
      if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
        const temp = flattenObj(ob[i]);
        for (const j in temp) {
          result[j] = temp[j];
        }
      } else {
        result[i] = ob[i];
      }
    }
    return result;
  };

  const handleClick = (e) => {
    if (e.target.getAttribute("data-id") === "number") {
      setClicked(!clicked);
    }
  };

  let numbers = [];

  if (clicked) {
    numbers = users
      ?.map((user) => user.location.street.number)
      .sort((a, b) => a - b);
  } else {
    numbers = users
      ?.map((user) => user.location.street.number)
      .sort((a, b) => b - a);
  }

  console.log(users);

  return (
    <div className="App">
      <table>
        <tr>
          {Object.keys(flattenObj(users[0]?.location))
            .slice(0, 8)
            .map((location) => (
              <th onClick={handleClick} data-id={location}>
                {location}
              </th>
            ))}
        </tr>

        {numbers.map((number, index) => {
          return (
            <tr>
              <td>{number}</td>
              {users.map((user) => {
                if (number === user.location.street.number) {
                  return (
                    <>
                      <td>{user.location.street.name}</td>
                      <td>{user.location.city}</td>
                      <td>{user.location.state}</td>
                      <td>{user.location.country}</td>
                      <td>{user.location.postcode}</td>
                      <td>{user.location.coordinates.latitude}</td>
                      <td>{user.location.coordinates.longitude}</td>
                    </>
                  );
                }
              })}
            </tr>
          );
        })}
      </table>
    </div>
  );
}

export default App;
