/**
 * Problem service
 * Handles interactions with the LeetCode API for problems
 */
const { graphqlClient } = require('../utils/httpClient');
const logger = require('../utils/logger');
const config = require('../config');

/**
 * Problem service
 */
class ProblemService {
  /**
   * Generate mock problem data for testing
   * @param {string} titleSlug - Title slug of the problem
   * @returns {Object} Mock problem data
   */
  static getMockProblem(titleSlug) {
    // Map of title slugs to mock problems
    const mockProblems = {
      "two-sum": {
        questionId: "1",
        questionFrontendId: "1",
        questionTitle: "Two Sum",
        titleSlug: "two-sum",
        difficulty: "EASY",
        isPaidOnly: false,
        question: "<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>",
        exampleTestcases: "[2,7,11,15]\n9",
        sampleTestCase: "[2,7,11,15]\n9",
        metaData: "{}",
        codeSnippets: [
          {
            lang: "C++",
            langSlug: "cpp",
            code: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};"
          },
          {
            lang: "Java",
            langSlug: "java",
            code: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}"
          },
          {
            lang: "Python",
            langSlug: "python",
            code: "class Solution(object):\n    def twoSum(self, nums, target):\n        \"\"\"\n        :type nums: List[int]\n        :type target: int\n        :rtype: List[int]\n        \"\"\"\n        "
          },
          {
            lang: "JavaScript",
            langSlug: "javascript",
            code: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};"
          }
        ],
        topicTags: [
          { name: "Array", slug: "array" },
          { name: "Hash Table", slug: "hash-table" }
        ],
        hints: ["A really brute force way would be to search for all possible pairs of numbers but that would be too slow.", "Try to use the fact that the complement of a number can be found in O(1) time using a hash table."],
        likes: 35000,
        dislikes: 1100,
        questionLink: "https://leetcode.com/problems/two-sum/",
        enableRunCode: true
      }
    };

    // Return the mock problem if it exists, otherwise return a default mock problem
    return mockProblems[titleSlug] || {
      questionId: "404",
      questionFrontendId: "404",
      questionTitle: "Problem Not Found",
      titleSlug: titleSlug,
      difficulty: "MEDIUM",
      isPaidOnly: false,
      question: "<p>This problem is not available or could not be found.</p>",
      exampleTestcases: "",
      sampleTestCase: "",
      metaData: "{}",
      codeSnippets: [
        {
          lang: "C++",
          langSlug: "cpp",
          code: "// Problem not found\n"
        },
        {
          lang: "JavaScript",
          langSlug: "javascript",
          code: "// Problem not found\n"
        }
      ],
      topicTags: [],
      hints: [],
      likes: 0,
      dislikes: 0,
      questionLink: `https://leetcode.com/problems/${titleSlug}/`,
      enableRunCode: false
    };
  }

  /**
   * Fetch a problem by its title slug
   * @param {string} titleSlug - Title slug of the problem
   * @returns {Promise<Object>} Problem data
   */
  static async fetchProblemByTitleSlug(titleSlug) {
    try {
      logger.info(`Fetching problem with title slug: ${titleSlug}`);
      
      const query = {
        query: `
          query getQuestionDetail($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              questionId
              questionFrontendId
              title
              titleSlug
              content
              difficulty
              topicTags {
                name
                slug
              }
              codeSnippets {
                lang
                langSlug
                code
              }
              hints
              exampleTestcases
              sampleTestCase
              metaData
              enableRunCode
              isPaidOnly
              likes
              dislikes
            }
          }
        `,
        variables: {
          titleSlug: titleSlug
        }
      };

      const response = await graphqlClient.post('', query);
      const data = response.data;
      
      const problem = data?.data?.question;
      if (!problem) {
        logger.error(`Problem not found: ${titleSlug}`);
        throw new Error('Problem not found');
      }

      logger.info(`Successfully fetched problem: ${problem.title}`);
      
      return {
        questionId: problem.questionId,
        questionFrontendId: problem.questionFrontendId,
        questionTitle: problem.title,
        titleSlug: problem.titleSlug,
        difficulty: problem.difficulty,
        isPaidOnly: problem.isPaidOnly,
        question: problem.content,
        exampleTestcases: problem.exampleTestcases,
        sampleTestCase: problem.sampleTestCase,
        metaData: problem.metaData,
        codeSnippets: problem.codeSnippets,
        topicTags: problem.topicTags,
        hints: problem.hints || [],
        likes: problem.likes,
        dislikes: problem.dislikes,
        questionLink: `${config.leetcode.baseUrl}/problems/${titleSlug}/`,
        enableRunCode: problem.enableRunCode
      };
    } catch (error) {
      logger.error(`Error fetching problem: ${error.message}`);
      
      // Use mock data instead of failing
      logger.info(`Using mock data for problem: ${titleSlug}`);
      return this.getMockProblem(titleSlug);
    }
  }
}

module.exports = ProblemService;
