// pages/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, Typography, Switch } from '@mui/material';
import CodeEditor from '../components/CodeEditor';
import { IdleTimer } from 'react-idle-timer';

const languages = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
];

const IndexPage: React.FC = () => {
  const [code, setCode] = useState<string>('console.log("Hello World!");');
  const [language, setLanguage] = useState<string>('javascript');
  const [output, setOutput] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'vs-dark'>('light');
  const [idleWarning, setIdleWarning] = useState<boolean>(false);

  // Idle Timer callback
  const handleOnIdle = useCallback(() => {
    setIdleWarning(true);
  }, []);

  // Reset idle warning when user becomes active
  const handleOnActive = useCallback(() => {
    setIdleWarning(false);
  }, []);

  // Execute code (simulate a backend API call)
  const executeCode = async () => {
    // For demo, we'll simulate execution with a timeout.
    setOutput('Executing...');
    // In production, call your backend API and pass code and language.
    setTimeout(() => {
      // Simulated output
      setOutput(`Output:\n${code}`);
    }, 1000);
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <IdleTimer timeout={30000} onIdle={handleOnIdle} onActive={handleOnActive} />
      
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h4">Online Code Editor</Typography>
        <Box display="flex" alignItems="center">
          <Typography>Light</Typography>
          <Switch
            checked={theme === 'vs-dark'}
            onChange={() => setTheme(theme === 'light' ? 'vs-dark' : 'light')}
            color="primary"
          />
          <Typography>Dark</Typography>
        </Box>
      </Box>

      {/* Language Selector */}
      <FormControl sx={{ minWidth: 150, marginBottom: 2 }}>
        <InputLabel id="language-select-label">Language</InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={language}
          label="Language"
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.value} value={lang.value}>
              {lang.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Code Editor */}
      <CodeEditor
        language={language}
        value={code}
        onChange={(val) => setCode(val || '')}
        theme={theme}
      />

      {/* Execution Panel */}
      <Box marginTop={2}>
        <Button variant="contained" color="primary" onClick={executeCode}>
          Execute
        </Button>
      </Box>
      <Box marginTop={2} p={2} border="1px solid #ccc" borderRadius="4px">
        <Typography variant="h6">Output:</Typography>
        <pre>{output}</pre>
      </Box>

      {/* Idle Warning */}
      {idleWarning && (
        <Box marginTop={2} p={2} bgcolor="warning.main" color="white">
          <Typography>You have been idle for 30 seconds!</Typography>
        </Box>
      )}
    </Container>
  );
};

export default IndexPage;
