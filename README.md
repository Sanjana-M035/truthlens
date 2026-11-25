# TruthLens

Multimodal misinformation and deepfake risk checker. Paste text or upload an image, audio or video, and get risk indicators with plain-language evidence.

Live demo: https://truthlens-site-1.vercel.app

## How it works
- Text, image and video: analysed by an AI model (video via 4 sampled frames)
- Audio: audio statistics are extracted in the browser and assessed
- Cross-modal check: compares the claim or caption with the content
- Explainable output: every finding shows what was observed and why it matters

## Limits
Results are risk signals, not proof. Human review is needed for important decisions.

## Stack
HTML, React, Tailwind, Vercel serverless function (api/analyze.js), Gemini API
