import { useEffect, useState } from "react";
import { trpc } from "./trpc";
import type { Config } from "../backend/procedures";
import { InputText } from "primereact/inputtext";

function App() {
  const [config, setConfig] = useState<null | Config>(null);
  const [filteredTags, setFilteredTags] = useState<Set<string>>(new Set([]));
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    trpc.getConfig.query().then((config) => {
      setConfig(config);
    });
  }, []);

  if (!config) return <div>Loading</div>;

  const allTags = [
    ...new Set(config.packages.map((p) => p.tags).flat(1)),
  ].sort();

  const sortedPackages = config.packages
    .filter((p) => p.name.includes(filterText))
    .filter(
      (p) =>
        !filteredTags.size ||
        [...filteredTags.values()].every((t) => p.tags.includes(t)),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-2 px-2">
      <h1>Packages</h1>

      <div id="header" className="py-2 flex">
        <div className="flex flex-col w-fit">
          <label htmlFor="search">Search</label>
          <InputText
            id="search"
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <div id="tags">
          {allTags.map((t) => (
            <span
              key={t}
              className={`m-1 ${filteredTags.has(t) ? "bg-amber-600" : "bg-amber-800"} p-1 rounded hover:cursor-crosshair`}
              onClick={() => {
                setFilteredTags((prev) => {
                  const newSet = new Set(prev);
                  if (newSet.has(t)) {
                    newSet.delete(t);
                  } else {
                    newSet.add(t);
                  }
                  return newSet;
                });
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="gap-2 grid grid-cols-4">
        {sortedPackages.map((p) => (
          <div key={p.name} className="border rounded p-1 relative">
            <div
              className="absolute right-5 top-5 w-5 h-5 border rounded-full flex justify-center items-center hover:text-red-800"
              onClick={() => {
                if (!confirm("Are you sure?")) return;
                const new_config = structuredClone(config);

                new_config.packages = new_config.packages.filter(
                  (pa) => pa.name != p.name,
                );

                trpc.updateConfig.mutate(new_config);
                setConfig(new_config);
              }}
            >
              x
            </div>
            <p>
              <strong>Name:</strong>
              {p.name}
            </p>
            <p>
              <strong>Repo:</strong>
              {p.repository}
            </p>
            <p>
              <strong>Dependencies:</strong>
              {p.dependencies.map((d) => d.name).join(", ")}
            </p>
            <p>
              <strong>Tags: </strong>{" "}
              <span className="flex gap-1">
                {p.tags.map((t) => (
                  <i key={t} className="border border-red-400 p-0.5 rounded-md">
                    #{t + " "}
                  </i>
                ))}

                <button
                  onClick={() => {
                    const tag = prompt();

                    if (!tag) return;

                    const new_config = structuredClone(config);

                    const package_index = config.packages.findIndex(
                      (pa) => pa.name === p.name,
                    );

                    new_config.packages[package_index] = {
                      ...new_config.packages[package_index],
                      tags: [...new_config.packages[package_index].tags, tag],
                    };

                    trpc.updateConfig.mutate(new_config);

                    setConfig(new_config);
                  }}
                >
                  +
                </button>
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
