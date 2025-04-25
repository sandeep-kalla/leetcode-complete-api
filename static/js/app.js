// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Tab Navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // API Base URL
    const API_BASE_URL = '';  // Empty string for relative URLs

    // Helper function to display results
    const displayResult = (containerId, data, error = false) => {
        const container = document.getElementById(containerId);
        const codeElement = container.querySelector('code');

        if (error) {
            codeElement.textContent = JSON.stringify({ error: data }, null, 2);
        } else {
            codeElement.textContent = JSON.stringify(data, null, 2);
        }

        // Apply syntax highlighting
        hljs.highlightElement(codeElement);

        // Show the result container
        container.style.display = 'block';
    };

    // Helper function to make API requests
    const makeRequest = async (url, method = 'GET', data = null, headers = {}) => {
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                }
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'An error occurred');
            }

            return responseData;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    };

    // Daily Challenge
    const getDailyBtn = document.getElementById('get-daily-btn');
    if (getDailyBtn) {
        getDailyBtn.addEventListener('click', async () => {
            try {
                const data = await makeRequest(`${API_BASE_URL}/api/leetcode/daily`);
                displayResult('daily-result', data);
            } catch (error) {
                displayResult('daily-result', error.message, true);
            }
        });
    }

    // Get Problem by Title Slug
    const getProblemBtn = document.getElementById('get-problem-btn');
    if (getProblemBtn) {
        getProblemBtn.addEventListener('click', async () => {
            try {
                const titleSlug = document.getElementById('problem-slug').value.trim();
                if (!titleSlug) {
                    throw new Error('Title slug is required');
                }

                const data = await makeRequest(`${API_BASE_URL}/api/leetcode/problems/${titleSlug}`);
                displayResult('problem-result', data);
            } catch (error) {
                displayResult('problem-result', error.message, true);
            }
        });
    }

    // Helper function to poll submission status
    const pollSubmissionStatus = async (submissionId, headers, resultContainerId) => {
        try {
            const maxAttempts = 30; // Maximum number of polling attempts
            const pollInterval = 1000; // Polling interval in milliseconds
            let attempts = 0;

            const resultContainer = document.getElementById(resultContainerId);
            const codeElement = resultContainer.querySelector('code');

            // Show the result container
            resultContainer.style.display = 'block';

            // Function to update the display with current status
            const updateStatus = (data, final = false) => {
                codeElement.textContent = JSON.stringify(data, null, 2);
                hljs.highlightElement(codeElement);

                // Add a message if we're still polling
                if (!final) {
                    const statusMessage = document.createElement('div');
                    statusMessage.className = 'polling-status';
                    statusMessage.textContent = `Polling submission status... (Attempt ${attempts}/${maxAttempts})`;

                    // Remove any existing status message
                    const existingStatus = resultContainer.querySelector('.polling-status');
                    if (existingStatus) {
                        resultContainer.removeChild(existingStatus);
                    }

                    resultContainer.appendChild(statusMessage);
                } else {
                    // Remove the polling status message when done
                    const existingStatus = resultContainer.querySelector('.polling-status');
                    if (existingStatus) {
                        resultContainer.removeChild(existingStatus);
                    }
                }
            };

            // Initial polling
            let response = await makeRequest(
                `${API_BASE_URL}/api/leetcode/submissions/${submissionId}/check`,
                'GET',
                null,
                headers
            );

            updateStatus(response);

            // Continue polling until we get a final state or reach max attempts
            while (
                attempts < maxAttempts &&
                (response.state === 'PENDING' || response.state === 'STARTED')
            ) {
                attempts++;

                // Wait for the polling interval
                await new Promise(resolve => setTimeout(resolve, pollInterval));

                // Poll again
                response = await makeRequest(
                    `${API_BASE_URL}/api/leetcode/submissions/${submissionId}/check`,
                    'GET',
                    null,
                    headers
                );

                updateStatus(response);
            }

            // Final update with the complete result
            updateStatus(response, true);

            return response;
        } catch (error) {
            console.error('Error polling submission status:', error);
            throw error;
        }
    };

    // Submit Solution
    const submitSolutionBtn = document.getElementById('submit-solution-btn');
    if (submitSolutionBtn) {
        submitSolutionBtn.addEventListener('click', async () => {
            try {
                const titleSlug = document.getElementById('submit-slug').value.trim();
                const lang = document.getElementById('submit-lang').value;
                const questionId = document.getElementById('submit-question-id').value.trim();
                const code = document.getElementById('submit-code').value;

                if (!titleSlug || !questionId || !code) {
                    throw new Error('Title slug, question ID, and code are required');
                }

                // Get authentication credentials from the auth tab
                const cookie = document.getElementById('auth-cookie').value.trim();
                const csrfToken = document.getElementById('auth-csrf').value.trim();

                const headers = {};
                if (cookie) {
                    headers['Cookie'] = cookie;
                }
                if (csrfToken) {
                    headers['x-csrftoken'] = csrfToken;
                }

                // Show a loading message
                const resultContainer = document.getElementById('submit-result');
                resultContainer.style.display = 'block';
                resultContainer.querySelector('code').textContent = 'Submitting solution...';

                // Use the proxy endpoint which is more reliable for submissions
                const initialResponse = await makeRequest(
                    `${API_BASE_URL}/api/leetcode/problems/submit-as-proxy`,
                    'POST',
                    {
                        titleSlug,
                        lang,
                        questionId,
                        code,
                        cookie,
                        csrfToken,
                        userAgent: navigator.userAgent,
                        origin: window.location.origin,
                        referer: window.location.href
                    }
                );

                // If we got a submission_id, enable the check submission button and pre-fill the ID
                if (initialResponse.submission_id) {
                    document.getElementById('check-submission-id').value = initialResponse.submission_id;

                    // Start polling for the submission status
                    await pollSubmissionStatus(
                        initialResponse.submission_id,
                        headers,
                        'submit-result'
                    );
                } else {
                    // Just display the initial response if no submission_id
                    displayResult('submit-result', initialResponse);
                }
            } catch (error) {
                displayResult('submit-result', error.message, true);
            }
        });
    }

    // Helper function to poll run code result
    const pollRunResult = async (interpretId, headers, resultContainerId) => {
        try {
            const maxAttempts = 30; // Maximum number of polling attempts
            const pollInterval = 1000; // Polling interval in milliseconds
            let attempts = 0;

            const resultContainer = document.getElementById(resultContainerId);
            const codeElement = resultContainer.querySelector('code');

            // Show the result container
            resultContainer.style.display = 'block';

            // Function to update the display with current status
            const updateStatus = (data, final = false) => {
                codeElement.textContent = JSON.stringify(data, null, 2);
                hljs.highlightElement(codeElement);

                // Add a message if we're still polling
                if (!final) {
                    const statusMessage = document.createElement('div');
                    statusMessage.className = 'polling-status';
                    statusMessage.textContent = `Polling run result... (Attempt ${attempts}/${maxAttempts})`;

                    // Remove any existing status message
                    const existingStatus = resultContainer.querySelector('.polling-status');
                    if (existingStatus) {
                        resultContainer.removeChild(existingStatus);
                    }

                    resultContainer.appendChild(statusMessage);
                } else {
                    // Remove the polling status message when done
                    const existingStatus = resultContainer.querySelector('.polling-status');
                    if (existingStatus) {
                        resultContainer.removeChild(existingStatus);
                    }
                }
            };

            // Initial polling
            let response = await makeRequest(
                `${API_BASE_URL}/api/leetcode/run-code/check/${interpretId}`,
                'GET',
                null,
                headers
            );

            updateStatus(response);

            // Continue polling until we get a final state or reach max attempts
            while (
                attempts < maxAttempts &&
                (response.state === 'PENDING' || response.state === 'STARTED')
            ) {
                attempts++;

                // Wait for the polling interval
                await new Promise(resolve => setTimeout(resolve, pollInterval));

                // Poll again
                response = await makeRequest(
                    `${API_BASE_URL}/api/leetcode/run-code/check/${interpretId}`,
                    'GET',
                    null,
                    headers
                );

                updateStatus(response);
            }

            // Final update with the complete result
            updateStatus(response, true);

            return response;
        } catch (error) {
            console.error('Error polling run result:', error);
            throw error;
        }
    };

    // Run Code
    const runCodeBtn = document.getElementById('run-code-btn');
    if (runCodeBtn) {
        runCodeBtn.addEventListener('click', async () => {
            try {
                const titleSlug = document.getElementById('run-slug').value.trim();
                const lang = document.getElementById('run-lang').value;
                const questionId = document.getElementById('run-question-id').value.trim();
                const code = document.getElementById('run-code').value;
                const input = document.getElementById('run-input').value;

                if (!titleSlug || !questionId || !code) {
                    throw new Error('Title slug, question ID, and code are required');
                }

                // Get authentication credentials from the auth tab
                const cookie = document.getElementById('auth-cookie').value.trim();
                const csrfToken = document.getElementById('auth-csrf').value.trim();

                const headers = {};
                if (cookie) {
                    headers['Cookie'] = cookie;
                }
                if (csrfToken) {
                    headers['x-csrftoken'] = csrfToken;
                }

                // Show a loading message
                const resultContainer = document.getElementById('run-result');
                resultContainer.style.display = 'block';
                resultContainer.querySelector('code').textContent = 'Running code...';

                const initialResponse = await makeRequest(
                    `${API_BASE_URL}/api/leetcode/run-code/${titleSlug}`,
                    'POST',
                    {
                        lang,
                        question_id: questionId,
                        typed_code: code,
                        data_input: input
                    },
                    headers
                );

                // If we got an interpret_id, enable the check run button and pre-fill the ID
                if (initialResponse.interpret_id) {
                    document.getElementById('check-run-id').value = initialResponse.interpret_id;

                    // Start polling for the run result
                    await pollRunResult(
                        initialResponse.interpret_id,
                        headers,
                        'run-result'
                    );
                } else {
                    // Just display the initial response if no interpret_id
                    displayResult('run-result', initialResponse);
                }
            } catch (error) {
                displayResult('run-result', error.message, true);
            }
        });
    }

    // Check Run Result
    const checkRunBtn = document.getElementById('check-run-btn');
    if (checkRunBtn) {
        checkRunBtn.addEventListener('click', async () => {
            try {
                const interpretId = document.getElementById('check-run-id').value.trim();

                if (!interpretId) {
                    throw new Error('Interpret ID is required');
                }

                // Get authentication credentials from the auth tab
                const cookie = document.getElementById('auth-cookie').value.trim();
                const csrfToken = document.getElementById('auth-csrf').value.trim();

                const headers = {};
                if (cookie) {
                    headers['Cookie'] = cookie;
                }
                if (csrfToken) {
                    headers['x-csrftoken'] = csrfToken;
                }

                const data = await makeRequest(
                    `${API_BASE_URL}/api/leetcode/run-code/check/${interpretId}`,
                    'GET',
                    null,
                    headers
                );
                displayResult('check-run-result', data);
            } catch (error) {
                displayResult('check-run-result', error.message, true);
            }
        });
    }

    // Check Submission
    const checkSubmissionBtn = document.getElementById('check-submission-btn');
    if (checkSubmissionBtn) {
        checkSubmissionBtn.addEventListener('click', async () => {
            try {
                const submissionId = document.getElementById('check-submission-id').value.trim();

                if (!submissionId) {
                    throw new Error('Submission ID is required');
                }

                // Get authentication credentials from the auth tab
                const cookie = document.getElementById('auth-cookie').value.trim();
                const csrfToken = document.getElementById('auth-csrf').value.trim();

                const headers = {};
                if (cookie) {
                    headers['Cookie'] = cookie;
                }
                if (csrfToken) {
                    headers['x-csrftoken'] = csrfToken;
                }

                const data = await makeRequest(
                    `${API_BASE_URL}/api/leetcode/submissions/${submissionId}/check`,
                    'GET',
                    null,
                    headers
                );
                displayResult('check-submission-result', data);
            } catch (error) {
                displayResult('check-submission-result', error.message, true);
            }
        });
    }

    // Get All Questions
    const getQuestionsBtn = document.getElementById('get-questions-btn');
    if (getQuestionsBtn) {
        getQuestionsBtn.addEventListener('click', async () => {
            try {
                const category = document.getElementById('questions-category').value.trim();
                const page = document.getElementById('questions-page').value;
                const pageSize = document.getElementById('questions-page-size').value;
                const difficulty = document.getElementById('questions-difficulty').value;
                const search = document.getElementById('questions-search').value.trim();

                let url = `${API_BASE_URL}/api/leetcode/questions?category=${category}&page=${page}&pageSize=${pageSize}`;

                if (difficulty) {
                    url += `&difficulty=${difficulty}`;
                }

                if (search) {
                    url += `&search=${encodeURIComponent(search)}`;
                }

                const data = await makeRequest(url);
                displayResult('questions-result', data);
            } catch (error) {
                displayResult('questions-result', error.message, true);
            }
        });
    }

    // Check Authentication
    const checkAuthBtn = document.getElementById('check-auth-btn');
    if (checkAuthBtn) {
        checkAuthBtn.addEventListener('click', async () => {
            try {
                const cookie = document.getElementById('auth-cookie').value.trim();
                const csrfToken = document.getElementById('auth-csrf').value.trim();

                const headers = {};
                if (cookie) {
                    headers['Cookie'] = cookie;
                }
                if (csrfToken) {
                    headers['x-csrftoken'] = csrfToken;
                }

                const data = await makeRequest(`${API_BASE_URL}/api/leetcode/auth-check`, 'GET', null, headers);
                displayResult('auth-result', data);
            } catch (error) {
                displayResult('auth-result', error.message, true);
            }
        });
    }

    // Fetch Cookies
    const fetchCookiesBtn = document.getElementById('fetch-cookies-btn');
    if (fetchCookiesBtn) {
        fetchCookiesBtn.addEventListener('click', async () => {
            try {
                const data = await makeRequest(`${API_BASE_URL}/api/leetcode/fetch-cookies`);
                displayResult('cookies-result', data);
            } catch (error) {
                displayResult('cookies-result', error.message, true);
            }
        });
    }
});
