/**
 * Questions service
 * Handles interactions with the LeetCode API for questions
 */
const { graphqlClient } = require('../utils/httpClient');
const logger = require('../utils/logger');

/**
 * Questions service
 */
class QuestionsService {
  /**
   * Generate mock questions data for testing
   * @param {number} skip - Number of questions to skip
   * @param {number} limit - Number of questions to return
   * @returns {Object} Mock questions data
   */
  static getMockQuestions(skip = 0, limit = 100) {
    // Create a list of mock questions
    const mockQuestions = [
      {
        questionId: "1",
        questionFrontendId: "1",
        title: "Two Sum",
        titleSlug: "two-sum",
        difficulty: "EASY",
        status: null,
        isPaidOnly: false,
        topicTags: [
          { name: "Array", slug: "array" },
          { name: "Hash Table", slug: "hash-table" }
        ],
        acRate: 0.4781
      },
      {
        questionId: "2",
        questionFrontendId: "2",
        title: "Add Two Numbers",
        titleSlug: "add-two-numbers",
        difficulty: "MEDIUM",
        status: null,
        isPaidOnly: false,
        topicTags: [
          { name: "Linked List", slug: "linked-list" },
          { name: "Math", slug: "math" },
          { name: "Recursion", slug: "recursion" }
        ],
        acRate: 0.3581
      },
      {
        questionId: "3",
        questionFrontendId: "3",
        title: "Longest Substring Without Repeating Characters",
        titleSlug: "longest-substring-without-repeating-characters",
        difficulty: "MEDIUM",
        status: null,
        isPaidOnly: false,
        topicTags: [
          { name: "Hash Table", slug: "hash-table" },
          { name: "String", slug: "string" },
          { name: "Sliding Window", slug: "sliding-window" }
        ],
        acRate: 0.3281
      }
    ];

    // Generate more mock questions if needed
    for (let i = 4; i <= 100; i++) {
      mockQuestions.push({
        questionId: i.toString(),
        questionFrontendId: i.toString(),
        title: `Mock Problem ${i}`,
        titleSlug: `mock-problem-${i}`,
        difficulty: i % 3 === 0 ? "HARD" : i % 2 === 0 ? "MEDIUM" : "EASY",
        status: null,
        isPaidOnly: i % 10 === 0,
        topicTags: [
          { name: "Array", slug: "array" },
          { name: "Dynamic Programming", slug: "dynamic-programming" }
        ],
        acRate: Math.random()
      });
    }

    // Total number of questions
    const totalQuestions = 100;

    // Apply pagination
    const startIdx = Math.min(skip, mockQuestions.length);
    const endIdx = Math.min(skip + limit, mockQuestions.length);
    const paginatedQuestions = mockQuestions.slice(startIdx, endIdx);

    return {
      questions: paginatedQuestions,
      total: totalQuestions,
      page: Math.floor(skip / limit) + 1,
      pageSize: limit
    };
  }

  /**
   * Fetch all LeetCode questions with pagination and filtering
   * @param {string} category - Category of questions to fetch
   * @param {number} skip - Number of questions to skip
   * @param {number} limit - Number of questions to return
   * @param {Object} filters - Filters to apply
   * @returns {Promise<Object>} Questions data
   */
  static async getAllQuestions(category = 'all-code-essentials', skip = 0, limit = 100, filters = {}) {
    try {
      logger.info(`Fetching questions with category: ${category}, skip: ${skip}, limit: ${limit}, filters: ${JSON.stringify(filters)}`);
      
      // Build variables for the GraphQL query
      const variables = {
        categorySlug: category,
        skip,
        limit,
        filters: {}
      };
      
      // Add difficulty filter if provided
      if (filters.difficulty) {
        variables.filters.difficulty = filters.difficulty;
      }
      
      // Add search filter if provided
      if (filters.search) {
        variables.searchKeyword = filters.search;
      }
      
      const query = {
        operationName: "problemsetQuestionListV2",
        query: `
          query problemsetQuestionListV2($filters: QuestionFilterInput, $limit: Int, $searchKeyword: String, $skip: Int, $sortBy: QuestionSortByInput, $categorySlug: String) {
            problemsetQuestionListV2(
              filters: $filters
              limit: $limit
              searchKeyword: $searchKeyword
              skip: $skip
              sortBy: $sortBy
              categorySlug: $categorySlug
            ) {
              questions {
                id
                titleSlug
                title
                questionFrontendId
                paidOnly
                difficulty
                topicTags {
                  name
                  slug
                }
                status
                acRate
              }
              totalLength
              finishedLength
              hasMore
            }
          }
        `,
        variables
      };

      const response = await graphqlClient.post('', query);
      const data = response.data;
      
      const problemset = data?.data?.problemsetQuestionListV2;
      
      // Check if we got a valid response
      if (!problemset || !problemset.questions) {
        logger.error('No questions found in API response, using mock data');
        return this.getMockQuestions(skip, limit);
      }
      
      const questions = problemset.questions;
      const total = problemset.totalLength || questions.length;
      
      logger.info(`Successfully fetched ${questions.length} questions out of ${total} total`);
      
      // Map the response to match our expected format
      const formattedQuestions = questions.map(q => ({
        questionId: q.id.toString(),
        questionFrontendId: q.questionFrontendId,
        title: q.title,
        titleSlug: q.titleSlug,
        difficulty: q.difficulty,
        status: q.status,
        isPaidOnly: q.paidOnly,
        topicTags: q.topicTags || [],
        acRate: q.acRate
      }));
      
      return {
        questions: formattedQuestions,
        total,
        page: Math.floor(skip / limit) + 1,
        pageSize: limit
      };
    } catch (error) {
      logger.error(`Error fetching questions: ${error.message}`);
      
      // Use mock data instead of failing
      logger.info('Using mock data for questions');
      return this.getMockQuestions(skip, limit);
    }
  }
}

module.exports = QuestionsService;
