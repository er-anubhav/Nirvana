import os
import io
import wave
import time
import threading
from typing import Optional, Dict, Any
from elevenlabs.client import ElevenLabs
from config import logger, ELEVENLABS_API_KEY, elevenlabs_configured

class VoiceService:
    def __init__(self):
        self.elevenlabs_client = None
        self.is_recording = False
        self.audio_data = []
        
        if elevenlabs_configured and ELEVENLABS_API_KEY:
            try:
                self.elevenlabs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
                logger.info("✅ ElevenLabs client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize ElevenLabs client: {e}")
                self.elevenlabs_client = None
        else:
            logger.warning("ElevenLabs not configured - voice features disabled")

    def text_to_speech(self, text: str, voice_id: str = "EXAVITQu4vr4xnSDxMaL") -> Optional[bytes]:
        """
        Convert text to speech using ElevenLabs API
        
        Args:
            text: Text to convert to speech
            voice_id: ElevenLabs voice ID
            
        Returns:
            Audio bytes or None if failed
        """
        if not self.elevenlabs_client:
            logger.error("ElevenLabs client not initialized")
            return None
            
        try:
            logger.info(f"🔄 Converting text to speech with ElevenLabs: {text[:50]}...")
            
            # Call ElevenLabs Text-to-Speech API
            audio = self.elevenlabs_client.text_to_speech.convert(
                text=text,
                voice_id=voice_id,
                model_id="eleven_multilingual_v2"
            )
              # Read the audio bytes from the iterator
            audio_bytes = b''.join(list(audio))
            
            logger.info(f"✅ Text-to-speech successful - {len(audio_bytes)} bytes of audio generated")
            return audio_bytes
            
        except Exception as e:
            logger.error(f"Error in text-to-speech conversion: {e}")
            return None

    def save_audio_to_file(self, audio_bytes: bytes, output_path: str) -> bool:
        """
        Save audio bytes to a file
        
        Args:
            audio_bytes: Audio data as bytes
            output_path: Path to save the audio file
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Create directory if needed
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Write bytes to file
            with open(output_path, 'wb') as f:
                f.write(audio_bytes)
                
            logger.info(f"✅ Audio saved to {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving audio file: {e}")
            return False

    def transcribe_audio(self, audio_data: bytes, language_code: str = "eng") -> Optional[Dict[str, Any]]:
        """
        Transcribe audio data using ElevenLabs Speech-to-Text API
        
        Args:
            audio_data: Audio data as bytes
            language_code: Language code (e.g., "eng" for English, "hin" for Hindi)
            
        Returns:
            Transcription result or None if failed
        """
        if not self.elevenlabs_client:
            logger.error("ElevenLabs client not initialized")
            return None
            
        try:
            logger.info("🔄 Sending audio to ElevenLabs for transcription...")
            
            # Create audio buffer for ElevenLabs
            audio_buffer = io.BytesIO(audio_data)
            
            # Call ElevenLabs Speech-to-Text API
            transcription = self.elevenlabs_client.speech_to_text.convert(
                file=audio_buffer,
                model_id="scribe_v1",  # Currently the only supported model
                tag_audio_events=True,  # Tag audio events like laughter, etc.
                language_code=language_code,  # Language of the audio
                diarize=False  # We don't need speaker identification for complaints
            )
            
            logger.info("✅ Audio transcription completed successfully")
            
            # Extract the transcribed text
            if hasattr(transcription, 'text'):
                transcribed_text = transcription.text
            else:
                # Handle different response formats
                transcribed_text = str(transcription)
                
            result = {
                'text': transcribed_text,
                'language': language_code,
                'raw_response': transcription
            }
            
            logger.info(f"📝 Transcribed text: {transcribed_text[:100]}...")
            return result
            
        except Exception as e:
            logger.error(f"Error transcribing audio: {e}")
            return None

    def transcribe_audio_file(self, file_path: str, language_code: str = "eng") -> Optional[Dict[str, Any]]:
        """
        Transcribe audio from file path
        
        Args:
            file_path: Path to audio file
            language_code: Language code
            
        Returns:
            Transcription result or None if failed
        """
        try:
            with open(file_path, 'rb') as audio_file:
                audio_data = audio_file.read()
                return self.transcribe_audio(audio_data, language_code)
        except Exception as e:
            logger.error(f"Error reading audio file {file_path}: {e}")
            return None

# Create a global instance
voice_service = VoiceService()
