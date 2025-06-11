import os
import io
import wave
import time
import threading
import pyaudio
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

    def record_audio(self, duration: int = 10, sample_rate: int = 16000, chunk_size: int = 1024) -> Optional[bytes]:
        """
        Record audio from microphone for specified duration
        
        Args:
            duration: Recording duration in seconds
            sample_rate: Audio sample rate
            chunk_size: Audio chunk size
            
        Returns:
            Audio data as bytes or None if failed
        """
        try:
            # Initialize PyAudio
            audio = pyaudio.PyAudio()
            
            # Configure audio stream
            stream = audio.open(
                format=pyaudio.paInt16,
                channels=1,
                rate=sample_rate,
                input=True,
                frames_per_buffer=chunk_size
            )
            
            logger.info(f"🎤 Recording audio for {duration} seconds...")
            print(f"Recording for {duration} seconds. Speak now!")
            
            frames = []
            self.is_recording = True
            
            # Record audio in chunks
            for i in range(0, int(sample_rate / chunk_size * duration)):
                if not self.is_recording:
                    break
                    
                data = stream.read(chunk_size)
                frames.append(data)
                
                # Show progress
                if i % (sample_rate // chunk_size) == 0:
                    remaining = duration - (i // (sample_rate // chunk_size))
                    print(f"Recording... {remaining} seconds remaining")
            
            # Stop recording
            stream.stop_stream()
            stream.close()
            audio.terminate()
            
            # Convert to WAV format
            audio_buffer = io.BytesIO()
            with wave.open(audio_buffer, 'wb') as wav_file:
                wav_file.setnchannels(1)
                wav_file.setsampwidth(audio.get_sample_size(pyaudio.paInt16))
                wav_file.setframerate(sample_rate)
                wav_file.writeframes(b''.join(frames))
            
            audio_data = audio_buffer.getvalue()
            logger.info(f"✅ Audio recorded successfully ({len(audio_data)} bytes)")
            return audio_data
            
        except Exception as e:
            logger.error(f"Error recording audio: {e}")
            print(f"Error recording audio: {e}")
            return None

    def stop_recording(self):
        """Stop current recording"""
        self.is_recording = False
        logger.info("🛑 Recording stopped by user")

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

    def process_voice_complaint(self, duration: int = 15, language_code: str = "eng") -> Optional[str]:
        """
        Complete workflow: Record audio and transcribe to text for complaint
        
        Args:
            duration: Recording duration in seconds
            language_code: Language code for transcription
            
        Returns:
            Transcribed complaint text or None if failed
        """
        try:
            print("\n" + "="*50)
            print("🎤 VOICE COMPLAINT REGISTRATION")
            print("="*50)
            print(f"Recording will start in 3 seconds...")
            print("Speak clearly about your complaint/issue.")
            print(f"You have {duration} seconds to speak.")
            print("Press Ctrl+C anytime to stop recording early.")
            print("-"*50)
            
            # Countdown
            for i in range(3, 0, -1):
                print(f"Starting in {i}...")
                time.sleep(1)
            
            # Record audio
            audio_data = self.record_audio(duration)
            if not audio_data:
                print("❌ Failed to record audio")
                return None
            
            print("\n🔄 Processing your voice complaint...")
            
            # Transcribe audio
            transcription_result = self.transcribe_audio(audio_data, language_code)
            if not transcription_result:
                print("❌ Failed to transcribe audio")
                return None
            
            complaint_text = transcription_result['text'].strip()
            
            print("\n" + "="*50)
            print("✅ VOICE COMPLAINT TRANSCRIBED")
            print("="*50)
            print(f"Your complaint: {complaint_text}")
            print("="*50)
            
            return complaint_text
            
        except KeyboardInterrupt:
            print("\n🛑 Recording stopped by user")
            self.stop_recording()
            return None
        except Exception as e:
            logger.error(f"Error in voice complaint processing: {e}")
            print(f"❌ Error processing voice complaint: {e}")
            return None

# Create a global instance
voice_service = VoiceService()
