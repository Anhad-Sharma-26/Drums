const { useState, useEffect } = React;

/*
 Data for the 9 pads in the exact order required by FCC:
 Q, W, E, A, S, D, Z, X, C
 Each object provides:
  - key: the keyboard character (id for the audio element)
  - id: descriptive id for the drum-pad wrapper (matches FCC expectation)
  - name: display text for #display
  - src: audio URL
*/
const PADS = [
  {
    key: "Q",
    id: "Heater-1",
    name: "Heater 1",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-1.mp3",
  },
  {
    key: "W",
    id: "Heater-2",
    name: "Heater 2",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-2.mp3",
  },
  {
    key: "E",
    id: "Heater-3",
    name: "Heater 3",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-3.mp3",
  },
  {
    key: "A",
    id: "Heater-4",
    name: "Heater 4",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-4_1.mp3",
  },
  {
    key: "S",
    id: "Clap",
    name: "Clap",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-6.mp3",
  },
  {
    key: "D",
    id: "Open-HH",
    name: "Open-HH",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Dsc_Oh.mp3",
  },
  {
    key: "Z",
    id: "Kick-n'-Hat",
    name: "Kick-n'-Hat",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Kick_n_Hat.mp3",
  },
  {
    key: "X",
    id: "Kick",
    name: "Kick",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/RP4_KICK_1.mp3",
  },
  {
    key: "C",
    id: "Closed-HH",
    name: "Closed-HH",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Cev_H2.mp3",
  },
];

function DrumPad({ pad, onTrigger }) {
  // local active flag for visual feedback
  const [active, setActive] = useState(false);

  const trigger = () => {
    const audio = document.getElementById(pad.key);
    if (!audio) return;
    // restart audio and play
    try {
      audio.currentTime = 0;
    } catch (e) {
      // ignore if not allowed to set currentTime
    }
    const p = audio.play();
    if (p?.catch) p.catch(() => {});
    // notify parent to update display
    onTrigger(pad.name);
    // visual feedback
    setActive(true);
    setTimeout(() => setActive(false), 120);
  };

  return (
    <div
      className={`drum-pad${active ? " active" : ""}`}
      id={pad.id}
      onClick={trigger}
      role="button"
      tabIndex="0"
      aria-pressed={active ? "true" : "false"}
      // optional: support Enter/Space for accessibility
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          trigger();
        }
      }}
    >
      <audio className="clip" id={pad.key} src={pad.src} preload="auto"></audio>
      {pad.key}
    </div>
  );
}

function App() {
  const [display, setDisplay] = useState("");

  // central handler for playing by key (used by keyboard listener)
  const playByKey = (key) => {
    const pad = PADS.find((p) => p.key === key);
    if (!pad) return;
    // find audio element and play
    const audio = document.getElementById(key);
    if (!audio) return;
    try {
      audio.currentTime = 0;
    } catch (e) {}
    const p = audio.play();
    if (p?.catch) p.catch(() => {});
    setDisplay(pad.name);
    // visual feedback: add and remove .active on parent pad element
    const padEl = document.getElementById(pad.id);
    if (padEl) {
      padEl.classList.add("active");
      setTimeout(() => padEl.classList.remove("active"), 120);
    }
  };

  // keyboard listener
  useEffect(() => {
    const handler = (e) => {
      const key = (e.key || "").toUpperCase();
      // only handle our keys
      if (["Q", "W", "E", "A", "S", "D", "Z", "X", "C"].includes(key)) {
        playByKey(key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div id="drum-machine">
      <div className="pads-grid">
        {PADS.map((pad) => (
          <DrumPad
            key={pad.key}
            pad={pad}
            onTrigger={(name) => setDisplay(name)}
          />
        ))}
      </div>

      <div id="display">{display}</div>
    </div>
  );
}

// mount
ReactDOM.render(<App />, document.getElementById("root"));
