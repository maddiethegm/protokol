# protokol

A lightweight Node.js logging utility that writes to both `console.log` and a persistent log file with automatic rotation.

---

## 🚀 Features

- ✅ **Dual Output** — Logs appear in console AND saved to file simultaneously
- ⏱️ **Auto Timestamping** — Every entry includes precise timestamp (down to milliseconds)
- 📁 **Automatic File Rotation** — Log files automatically rotate at 10MB default limit
- ⚙️ **Environment Config** — Easy customization via `PROTOKOL_LOG_PATH` environment variable
- 🛡️ **Graceful Shutdown** — Properly closes log file when process exits or is terminated
- 🔕 **Silent Error Handling** — Doesn't break your app if file write fails

---

## 📦 Installation

```bash
npm install mde-protokol
```


---

## 📝 Usage

### Basic Logging

Replace `console.log()` with `protokol()`:

```javascript
const { protokol } = require('protokol');

// Simple string logging
protokol('Application started successfully')

// Multiple arguments
protokol(user, 'User logged in:', new Date())

// Objects (auto-converted to JSON strings)
protokol({ name: 'Alice', action: 'purchase' })

// Arrays (comma-separated values)
protokol([1, 2, 3])
```

### Configuration

Set log file path via environment variable or method chaining:

```bash
export PROTOKOL_LOG_PATH='./my-app/logs/protokol.log'
```

Or configure programmatically:

```javascript
const { protokol } = require('protokol');

// Set custom log file location
protokol.config({
  logFilePath: './custom/path/logs/protokol.log',
  maxFileSize: 20 * 1024 * 1024 // 20MB instead of default 10MB
});
```

### Graceful Shutdown

The library automatically handles process cleanup on `exit`, `SIGINT`, or `SIGTERM`. You can also manually trigger:

```javascript
const { protokol } = require('protokol');

// Optional: manual shutdown with final marker
process.on('SIGINT', () => protokol.shutdown());
```

---

---

## ⚙️ Default Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| `logFilePath` | `./logs/protokol.log` | Path to main log file |
| `maxFileSize` | `10MB` | Size before automatic rotation |

---

## 🎨 Output Format

```
[2024-01-15 10:30:45.123] Application started successfully
[2024-01-15 10:30:46.456] User logged in: 1234
```

---

## 🛠️ Error Handling

File write errors are silently caught to prevent breaking your application. You can enable error logging in development mode:

```javascript
// Uncomment this line to see file write errors
process.stderr.write(`[Protokol Error] Failed to write to log: ${error.message}\n`);
```

---

## 📚 Example Application

```javascript
const { protokol } = require('protokol');

// Create app
class App {
  constructor() {
    this.name = 'MyApp';
    this.version = '1.0.0';
  }

  start() {
    protokol(this, 'Starting...', new Date());
    
    // Simulate some work
    setTimeout(() => {
      protokol('Task completed successfully');
      
      // Graceful shutdown
      proses.exit(0);
    }, 2000);
  }
}

const app = new App();
app.start();
```

---

## 📋 License

This project is licensed under the MIT License - see [`LICENSE`](./LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For issues or questions, please open an issue on the [GitHub repository](https://github.com/maddiethegm/protokol).

---

## ⭐️ Star This Repo!

If you found this useful, give it a star! ⭐️
