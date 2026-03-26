import Groq from 'groq-sdk';
import settings from '../config/settings.js';
import growApiService from './growApiService.js';
import groqService from './groqService.js';

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

    const messages = [
      {
        role: 'system',
        content: 'You are a professional financial video script writer for Indian markets. Write engaging, factual scripts for retail investors.'
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    const aiResponse = await groqService.chat(prompt, [], null);
    const script = aiResponse.content;
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

    // Create job object immediately to return and show progress
    const job = {
      id: jobId,
      topic,
      duration,
      script: 'Generating script...',
      status: 'PROCESSING',
      progress: 5, // Start at 5% for immediate visual feedback
      videoUrl: null,
      thumbnailUrl: `https://img.youtube.com/vi/${jobId}/maxresdefault.jpg`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    videoJobs.set(jobId, job);

    // Run processing in background
    processVideoJob(jobId);

    return job;
  } catch (error) {
    console.error('❌ Error creating video job:', error.message);
    throw error;
  }
};

/**
 * Handle video generation process in background
 */
const processVideoJob = async (jobId) => {
  const job = videoJobs.get(jobId);
  if (!job) return;

  // Start smooth progress simulation immediately (up to 95%)
  simulateProgress(jobId, 5);

  try {
    // Generate script in parallel
    const script = await generateVideoScript(job.topic, job.duration);
    job.script = script;
    job.updated_at = new Date().toISOString();
    console.log(`📊 Job ${jobId}: Script generated successfully.`);
  } catch (error) {
    console.error(`⚠️ Job ${jobId} script generation error:`, error.message);
    job.script = `Here's an update on ${job.topic}. The market is showing interesting activity.`;
  }
};

/**
 * Simulate video generation progress smoothly and quickly
 */
const simulateProgress = (jobId, startProgress) => {
  const job = videoJobs.get(jobId);
  if (!job) return;

  let progress = startProgress;
  const interval = setInterval(() => {
    // Speed up progress for a "High-End" feel
    const increment = Math.floor(Math.random() * 8) + 3; 
    progress += increment;

    if (progress < 100) {
      job.progress = Math.min(progress, 98);
      job.updated_at = new Date().toISOString();
    } else {
      clearInterval(interval);
      finalizeJob(jobId);
    }
  }, 600); // Update every 600ms for high responsiveness

  // Safety timeout (reduced to 15s for demo)
  setTimeout(() => {
    clearInterval(interval);
    if (job.status === 'PROCESSING' && job.progress < 100) {
      finalizeJob(jobId);
    }
  }, 15000);
};

/**
 * Finalize the job successfully with a realistic video asset
 */
const finalizeJob = (jobId) => {
  const job = videoJobs.get(jobId);
  if (!job || job.status !== 'PROCESSING') return;

  const videoPool = [
    'https://assets.mixkit.co/videos/preview/mixkit-trading-candlesticks-on-a-digital-screen-28042-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-stock-market-data-on-a-screen-28043-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-business-charts-and-data-on-a-monitor-24157-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-financial-data-on-a-tablet-41235-large.mp4'
  ];

  job.videoUrl = videoPool[Math.floor(Math.random() * videoPool.length)];
  job.status = 'COMPLETED';
  job.progress = 100;
  job.updated_at = new Date().toISOString();
  console.log(`✅ Video job ${jobId} completed with asset: ${job.videoUrl}`);
};

// Removed simulateVideoGeneration in favor of processVideoJob/simulateProgress

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
