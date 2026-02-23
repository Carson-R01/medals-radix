import { useEffect, useRef, useState } from "react";
import Country from "./components/Country";
import {
  Theme,
  Button,
  Flex,
  Heading,
  Badge,
  Container,
  Grid,
} from "@radix-ui/themes";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import "@radix-ui/themes/styles.css";
import "./App.css";
import NewCountry from "./components/NewCountry";
import {
  fetchCountries,
  createCountry,
  deleteCountry,
} from "./api.js";

function App() {
  const [appearance, setAppearance] = useState("dark");
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const medals = useRef([
    { id: 1, name: "gold", color: "#FFD700" },
    { id: 2, name: "silver", color: "#C0C0C0" },
    { id: 3, name: "bronze", color: "#CD7F32" },
  ]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCountries();
        setCountries(data);
      } catch (err) {
        console.error("Failed to load countries", err);
        setError("Unable to load countries from the API.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function toggleAppearance() {
    setAppearance(appearance === "light" ? "dark" : "light");
  }

  async function handleAdd(name) {
    try {
      const created = await createCountry(name);
      setCountries((prev) => [...prev, created]);
      setError(null);
    } catch (err) {
      console.error("Failed to add country", err);
      setError("Unable to add country. Please try again.");
    }
  }

  async function handleDelete(id) {
    let previous = countries;
    setCountries((prev) => {
      previous = prev;
      return prev.filter((c) => c.id !== id);
    });
    try {
      await deleteCountry(id);
      setError(null);
    } catch (err) {
      console.error("Failed to delete country", err);
      setCountries(previous);
      setError("Unable to delete country. Please try again.");
    }
  }
  function handleIncrement(countryId, medalName) {
    const idx = countries.findIndex((c) => c.id === countryId);
    if (idx === -1) return;
    const mutableCountries = [...countries];
    mutableCountries[idx][medalName] += 1;
    setCountries(mutableCountries);
  }
  function handleDecrement(countryId, medalName) {
    const idx = countries.findIndex((c) => c.id === countryId);
    if (idx === -1) return;
    const mutableCountries = [...countries];
    mutableCountries[idx][medalName] = Math.max(
      0,
      mutableCountries[idx][medalName] - 1
    );
    setCountries(mutableCountries);
  }
  function getAllMedalsTotal() {
    let sum = 0;
    medals.current.forEach((medal) => {
      sum += countries.reduce((a, b) => a + b[medal.name], 0);
    });
    return sum;
  }

  return (
    <Theme appearance={appearance}>
      <Button
        onClick={toggleAppearance}
        style={{ position: "fixed", bottom: 20, right: 20, zIndex: 100 }}
        variant="ghost"
      >
        {appearance === "dark" ? <MoonIcon /> : <SunIcon />}
      </Button>
      <Flex p="2" pl="8" className="fixedHeader" justify="between">
        <Heading size="6">
          Olympic Medals
          <Badge variant="outline" ml="2">
            <Heading size="6">{getAllMedalsTotal()}</Heading>
          </Badge>
        </Heading>
        <NewCountry onAdd={handleAdd} />
      </Flex>
      <Container className="bg"></Container>
      {error && (
        <Container p="3">
          <Badge color="red" variant="solid">
            {error}
          </Badge>
        </Container>
      )}
      {loading ? (
        <Container p="3">
          <Badge variant="soft">Loading countries...</Badge>
        </Container>
      ) : (
        <Grid pt="2" gap="2" className="grid-container">
          {countries
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((country) => (
              <Country
                key={country.id}
                country={country}
                medals={medals.current}
                onDelete={handleDelete}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />
            ))}
        </Grid>
      )}
    </Theme>
  );
}

export default App;
