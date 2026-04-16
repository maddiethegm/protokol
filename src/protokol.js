// protokol.js
/**
 * Protokol - Console.log wrapper that writes to both console and log file
 * 
 * Usage: Replace all console.log() calls with protokol(....)
 */

const fs = require('fs');
const path = require('path');

// Default configuration
const defaultConfig = {
  logFilePath: process.env.PROTOKOL_LOG_PATH || './logs/protokol.log',
  maxFileSize: 10 * 1024 * 1024, // 10MB
};

/**
 * Create timestamp for log entries (ISO format without T/Z)
 */
function createTimestamp() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
}

/**
 * Check if log file needs rotation based on size
 */
function checkRotation(filePath, maxFileSize) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size > maxFileSize;
  } catch (error) {
    return false;
  }
}

/**
 * Rotate log file to a timestamped backup
 */
function rotateLogFile(logFilePath) {
  const dirName = path.dirname(logFilePath);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const rotatedPath = `${logFilePath}.${timestamp}`;
  
  try {
    fs.renameSync(logFilePath, rotatedPath);
    return rotatedPath;
  } catch (error) {
    // If rotation fails, continue without rotating
    return null;
  }
}

/**
 * Protokol logger instance - initialized once and reused
 */
let logConfig = { ...defaultConfig };

/**
 * Protokol function - logs to both console and file
 * @param {...*} arguments - Any arguments to log
 * @returns {Function} protokol (for chaining)
 */
function protokol(...args) {
  // Convert arguments to string representation
  const content = args.map(arg => 
    typeof arg === 'string' ? arg : String(arg).slice(0, 2048) // Truncate very long strings
  ).join(' ');

  if (!content || content.length > 10000) {
    console.log('[Protokol] Skipped logging (empty or too long)');
    return protokol;
  }

  const timestamp = createTimestamp();
  const formattedContent = `[${timestamp}] ${content}`;

  // Always write to console first (non-blocking, fast)
  console.log(formattedContent);

  // Then asynchronously write to file
  try {
    const logFilePath = path.resolve(logConfig.logFilePath);
    
    // Check rotation if needed
    if (checkRotation(logFilePath, config.maxFileSize)) {
      rotateLogFile(logFilePath);
    }

    // Append to file (asynchronously, won't block console)
    fs.appendFileSync(logFilePath, formattedContent + '\n');
  } catch (error) {
    // Silently handle file write errors - don't break logging
    // Optionally log the error to stderr if needed
    // process.stderr.write(`[Protokol Error] Failed to write to log: ${error.message}\n`);
  }

  return protokol; // Return the function for potential chaining
}

/**
 * Protokol configuration method - set options like log path
 * @param {Object} options - Configuration options
 * @returns {Function} protokol (for chaining)
 */
function config(options = {}) {
  if (options.logFilePath) {
    config.logFilePath = path.resolve(options.logFilePath);
  }
  
  if (options.maxFileSize !== undefined) {
    config.maxFileSize = options.maxFileSize;
  }

  return protokol; // Return the function for potential chaining
}

/**
 * Protokol shutdown - write final marker and cleanup
 */
function shutdown() {
  try {
    const logFilePath = path.resolve(config.logFilePath);
    fs.appendFileSync(logFilePath, '=== LOG FILE CLOSED ===\n');
  } catch (error) {
    // Ignore errors on shutdown
  }
}

// Register shutdown handlers for graceful cleanup
process.on('exit', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = { protokol, config };
