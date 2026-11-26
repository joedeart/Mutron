# Mutron regression checklist

These behaviours must remain working whenever audio, timing, visuals, or settings are changed.

## Silent-mode recovery
- Start a run and let the metronome enter silent mode.
- Deliberately miss one silent beat.
- Confirm the metronome returns and the drum still accepts taps.
- Play through the next audible section into silent mode again.
- Confirm the first silent beat can be registered; the game must not auto-fail immediately.
- Repeat this cycle more than once in the same run.

## Tap scoring must stay independent of drum sound
- Drum sound ON: taps make a sound and score normally.
- Drum sound OFF: taps are silent but still score normally.
- Audio playback errors must never interrupt the tap-scoring handler.

## UI feedback
- TAP label stays at the bottom inside the drum, below the timing lights.
- A missed silent beat gives a brief red flash.
- Visual changes must not change beat timing or tap scoring.

## Implementation guardrails
- After a miss, discard stale scheduled beat records and pending silent beats.
- Restart the audible beat schedule from the current audio clock; do not catch up by rapidly scheduling old beats.
- Keep the audio clock as the scoring reference and preserve the original pointer event timestamp.


## Visual pulse and microphone input
- The large drum does not pulse automatically on metronome beats; only the beat lights do.
- The large drum animates when a touchscreen hit is made.
- Microphone permission can be granted or denied without breaking touchscreen play.
- Microphone startup calibrates background noise for 1.5 seconds; keep the drum quiet during calibration.
- Microphone uses a noise-relative threshold, a 300 ms cooldown, and must return below its release threshold before it can trigger again.
- With microphone enabled, one real drum impact triggers one virtual hit; ordinary room noise should not trigger hits or repeated hits.
- Test in a quiet room and a normal room; verify High, Medium, and Low sensitivity respond in the expected order.
- Microphone detection does not play the virtual drum sound back into the microphone input.
- Stop microphone mode and confirm the microphone indicator/button returns to OFF.
- Test microphone sensitivity in a quiet room and near the physical drum; headphones are recommended.
- Confirm touchscreen scoring and silent-mode recovery are unchanged when microphone mode is OFF.
