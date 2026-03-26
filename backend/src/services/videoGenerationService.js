import Groq from 'groq-sdk';
import settings from '../config/settings.js';
import growApiService from './growApiService.js';

const groq = new Groq({
  apiKey: settings.GROQ_API_KEY,
});

/**
 * Store video jobs in memory (should use database in production)
 */
const videoJobs = new Map();

/**
 * Generate AI market insights video script
 */
export const generateVideoScript = async (topic, duration) => {
  try {
    console.log(`📝 Generating video script for: ${topic} (${duration})`);

    // Get market data for context
    let marketContext = '';
    try {
      const marketData = await growApiService.getMarketOverview();
      const indices = marketData.indices || [];
      marketContext = indices
        .map(idx => `${idx.name}: ${idx.value} (${idx.change_pct > 0 ? '+' : ''}${idx.change_pct}%)`)
        .join(', ');
    } catch (err) {
      console.warn('⚠️ Could not fetch market data:', err.message);
      marketContext = 'Current market showing mixed signals';
    }

    // Create prompt for video script
    const durationMap = {
      '30s': '30 seconds',
      '60s': '60 seconds',
      '120s': '120 seconds',
    };

    const prompt = `You are a professional financial analyst creating a ${durationMap[duration]} AI-generated video script about "${topic}".

Current market context: ${marketContext}

Generate a concise, engaging video script for an AI avatar to read. Include:
1. Opening hook (2-3 sentences)
2. Main analysis/insights (3-5 points)
3. Key takeaway
4. Closing call-to-action

Format as a conversational script, not bullet points. Keep it precise for ${durationMap[duration]} duration.`;

    const message = await groq.chat.completions.create({
      model: settings.GROQ_MODEL || 'llama-3.3-70b-versatile',
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content: 'You are a professional financial video script writer for Indian markets. Write engaging, factual scripts for retail investors.'
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
    });

    const script = message.choices?.[0]?.message?.content || '';
    console.log(`✅ Video script generated: ${script.substring(0, 100)}...`);

    return script;
  } catch (error) {
    console.error('❌ Error generating video script:', error.message);
    return `Here's a market update on ${topic}. The broader market is showing interesting trends with various sectors performing differently. Stay tuned for more insights.`;
  }
};

/**
 * Create a video generation job
 */
export const createVideoJob = async (topic, duration = '60s') => {
  try {
    const jobId = `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`🎬 Creating video job: ${jobId}`);

    // Generate script
    const script = await generateVideoScript(topic, duration);

    // Create job object
    const job = {
      id: jobId,
      topic,
      duration,
      script,
      status: 'PROCESSING',
      progress: 0,
      videoUrl: null,
      thumbnailUrl: `https://img.youtube.com/vi/${jobId}/maxresdefault.jpg`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    videoJobs.set(jobId, job);

    // Simulate video processing
    simulateVideoGeneration(jobId);

    return job;
  } catch (error) {
    console.error('❌ Error creating video job:', error.message);
    throw error;
  }
};

/**
 * Simulate video generation progress
 * In production, this would call actual video generation API (Pika, Stability AI, etc.)
 */
const simulateVideoGeneration = (jobId) => {
  console.log(`⏳ Starting video generation simulation for ${jobId}`);

  const job = videoJobs.get(jobId);
  if (!job) return;

  // Simulate 10-second processing with progress updates
  let progress = 0;
  const interval = setInterval(() => {
    progress += 20;

    if (progress <= 100) {
      job.progress = Math.min(progress, 90);
      job.updated_at = new Date().toISOString();
      console.log(`📊 Job ${jobId} progress: ${job.progress}%`);
    }

    if (progress >= 100) {
      clearInterval(interval);

      // Generate mock video URL (in production: actual video file location)
      job.videoUrl = `https://assets.mixkit.co/videos/preview/mixkit-trading-candlesticks-on-a-digital-screen-28042-large.mp4`;
      job.status = 'COMPLETED';
      job.progress = 100;
      job.updated_at = new Date().toISOString();

      console.log(`✅ Video job ${jobId} completed: ${job.videoUrl}`);
    }
  }, 1000);

  // Safety timeout (30 seconds max)
  setTimeout(() => {
    clearInterval(interval);
    if (job.status === 'PROCESSING') {
      job.status = 'FAILED';
      job.error = 'Video generation timeout';
      console.error(`❌ Video job ${jobId} timeout`);
    }
  }, 30000);
};

/**
 * Get video job by ID
 */
export const getVideoJob = (jobId) => {
  return videoJobs.get(jobId) || null;
};

/**
 * Get all video jobs
 */
export const getAllVideoJobs = () => {
  return Array.from(videoJobs.values()).sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
};

/**
 * Delete video job
 */
export const deleteVideoJob = (jobId) => {
  const deleted = videoJobs.delete(jobId);
  if (deleted) {
    console.log(`🗑️ Video job ${jobId} deleted`);
  }
  return deleted;
};

/**
 * Get job progress
 */
export const getJobProgress = (jobId) => {
  const job = videoJobs.get(jobId);
  if (!job) {
    return null;
  }

  return {
    jobId,
    status: job.status,
    progress: job.progress,
    message: getProgressMessage(job.status, job.progress),
  };
};

/**
 * Get human-readable progress message
 */
const getProgressMessage = (status, progress) => {
  switch (status) {
    case 'PROCESSING':
      if (progress < 30) return 'Analyzing market data...';
      if (progress < 60) return 'Generating video content...';
      if (progress < 90) return 'Synthesizing AI performance...';
      return 'Finalizing video...';
    case 'COMPLETED':
      return 'Video ready! 🎬';
    case 'FAILED':
      return 'Video generation failed';
    default:
      return 'Processing...';
  }
};

export default {
  generateVideoScript,
  createVideoJob,
  getVideoJob,
  getAllVideoJobs,
  deleteVideoJob,
  getJobProgress,
};
