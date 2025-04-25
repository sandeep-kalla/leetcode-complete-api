/**
 * LeetCode models
 * Defines the data structures used in the application
 * 
 * Note: In a JavaScript implementation, these are not strict types like in TypeScript,
 * but they serve as documentation and can be validated with Joi schemas.
 */

/**
 * Headers model
 * @typedef {Object} HeadersModel
 * @property {string} [cookie] - Cookie header
 * @property {string} [csrfToken] - CSRF token
 * @property {string} [userAgent] - User agent
 * @property {string} [origin] - Origin header
 * @property {string} [referer] - Referer header
 */

/**
 * Topic tag model
 * @typedef {Object} TopicTag
 * @property {string} name - Tag name
 * @property {string} slug - Tag slug
 */

/**
 * Code snippet model
 * @typedef {Object} CodeSnippet
 * @property {string} lang - Programming language
 * @property {string} langSlug - Language slug
 * @property {string} code - Code snippet
 */

/**
 * Solution model
 * @typedef {Object} Solution
 * @property {string} id - Solution ID
 * @property {boolean} canSeeDetail - Whether the solution details can be seen
 * @property {boolean} paidOnly - Whether the solution is paid only
 * @property {boolean} [hasVideoSolution] - Whether the solution has a video
 * @property {boolean} [paidOnlyVideo] - Whether the video is paid only
 */

/**
 * Problem detail model
 * @typedef {Object} ProblemDetail
 * @property {string} questionId - Question ID
 * @property {string} questionFrontendId - Question frontend ID
 * @property {string} questionTitle - Question title
 * @property {string} titleSlug - Title slug
 * @property {string} difficulty - Difficulty level
 * @property {boolean} isPaidOnly - Whether the problem is paid only
 * @property {string} question - HTML content of the question
 * @property {string} exampleTestcases - Example test cases
 * @property {TopicTag[]} topicTags - Topic tags
 * @property {string[]} [hints] - Hints for the problem
 * @property {Solution} [solution] - Solution
 * @property {number} [likes] - Number of likes
 * @property {number} [dislikes] - Number of dislikes
 * @property {string} [similarQuestions] - Similar questions
 * @property {string} questionLink - Link to the question
 * @property {string} [sampleTestCase] - Sample test case
 * @property {string} [metaData] - Metadata
 * @property {CodeSnippet[]} [codeSnippets] - Code snippets
 * @property {boolean} [enableRunCode] - Whether running code is enabled
 */

/**
 * Daily challenge model
 * @typedef {Object} DailyChallenge
 * @property {string} questionLink - Link to the question
 * @property {string} date - Date of the challenge
 * @property {string} questionId - Question ID
 * @property {string} questionFrontendId - Question frontend ID
 * @property {string} questionTitle - Question title
 * @property {string} titleSlug - Title slug
 * @property {string} difficulty - Difficulty level
 * @property {boolean} isPaidOnly - Whether the problem is paid only
 * @property {string} question - HTML content of the question
 * @property {string} exampleTestcases - Example test cases
 * @property {TopicTag[]} topicTags - Topic tags
 * @property {string[]} hints - Hints for the problem
 * @property {Solution} [solution] - Solution
 * @property {number} [likes] - Number of likes
 * @property {number} [dislikes] - Number of dislikes
 * @property {string} [similarQuestions] - Similar questions
 */

/**
 * Submission request model
 * @typedef {Object} SubmissionRequest
 * @property {string} lang - Programming language
 * @property {string} question_id - Question ID
 * @property {string} typed_code - Code to submit
 */

/**
 * Submission status model
 * @typedef {Object} SubmissionStatus
 * @property {string} state - Submission state
 * @property {number} [status_code] - Status code
 * @property {string} [lang] - Programming language
 * @property {string} [runtime] - Runtime
 * @property {string|number} [memory] - Memory usage
 * @property {number} [total_correct] - Total correct test cases
 * @property {number} [total_testcases] - Total test cases
 * @property {string} submission_id - Submission ID
 * @property {string} [status_runtime] - Status runtime
 * @property {string} [status_memory] - Status memory
 * @property {string} [status_msg] - Status message
 * @property {string} [compare_result] - Compare result
 * @property {string} [code_output] - Code output
 * @property {string} [std_output] - Standard output
 * @property {string} [last_testcase] - Last test case
 * @property {string} [expected_output] - Expected output
 * @property {number} [task_finish_time] - Task finish time
 * @property {string} [question_id] - Question ID
 * @property {boolean} [run_success] - Whether the run was successful
 * @property {string} [pretty_lang] - Pretty language name
 * @property {number} [runtime_percentile] - Runtime percentile
 * @property {number} [memory_percentile] - Memory percentile
 * @property {boolean} [finished] - Whether the submission is finished
 * @property {number} [elapsed_time] - Elapsed time
 * @property {string} [display_runtime] - Display runtime
 */

/**
 * Authentication check response model
 * @typedef {Object} AuthCheckResponse
 * @property {boolean} isSignedIn - Whether the user is signed in
 * @property {string} [username] - Username
 * @property {string} [userId] - User ID
 * @property {string} [error] - Error message
 */

/**
 * Question list item model
 * @typedef {Object} QuestionListItem
 * @property {string} questionId - Question ID
 * @property {string} questionFrontendId - Question frontend ID
 * @property {string} title - Question title
 * @property {string} titleSlug - Title slug
 * @property {string} difficulty - Difficulty level
 * @property {string} [status] - Status
 * @property {boolean} isPaidOnly - Whether the question is paid only
 * @property {TopicTag[]} topicTags - Topic tags
 * @property {number} [acRate] - Acceptance rate
 */

/**
 * Question list response model
 * @typedef {Object} QuestionListResponse
 * @property {QuestionListItem[]} questions - List of questions
 * @property {number} total - Total number of questions
 * @property {number} page - Current page
 * @property {number} pageSize - Page size
 */

// Export the models (for documentation purposes)
module.exports = {
  // These are just for documentation, not actual implementations
};
