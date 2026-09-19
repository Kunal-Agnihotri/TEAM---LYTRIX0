# BRIDGE — Aashi Agricultural AI

## What changed

- Aashi now uses `agriculture_data_enriched.json` as the source for agricultural answers.
- Aashi's browser voice prioritises Indian-locale voices and known Indian female voices such as Heera/Swara when the browser/OS provides them.
- Speech-to-text uses the selected Indian language (`en-IN`, `hi-IN`, `pa-IN`, `mr-IN`, `ta-IN`, `te-IN`).
- `aashi_trainer.py` contains the Python/SAPI voice-selection reference and can test the installed Indian female voice.
- `aashi_engine.py` is now grounded in the bundled agricultural dataset instead of returning generic placeholder answers.

## Run the web app

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:3000`.

## Test the Python voice

On Windows:

```bash
pip install -r requirements.txt
python aashi_trainer.py
```

The Python voice module first tries Windows SAPI (`pywin32`) and then falls back to `pyttsx3`.

## Important voice note

The exact female voice is supplied by the voices installed on the user's operating system/browser. The code explicitly prioritises Indian female voice names/locales; if a matching voice is not installed, the browser uses the closest available Indian-language voice.

## Agriculture data

`agriculture_data_enriched.json` is loaded by the web application at runtime from `/agriculture_data_enriched.json`. Agricultural answers are restricted to the information present in that bundled dataset. Platform-demo information such as sample workers and schemes remains in `src/data/mockData.ts`.
