/**
 * LeetCode service
 * Handles interactions with the LeetCode API for daily challenges
 */
const { graphqlClient } = require('../utils/httpClient');
const logger = require('../utils/logger');

/**
 * LeetCode service
 */
class LeetCodeService {
  /**
   * Fetch the daily LeetCode challenge
   * @returns {Promise<Object>} Daily challenge data
   */
  static async fetchDailyChallenge() {
    try {
      logger.info('Fetching daily LeetCode challenge');
      
      const query = {
        query: `
          query questionOfToday {
            activeDailyCodingChallengeQuestion {
              date
              userStatus
              link
              question {
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
          }
        `
      };

      const response = await graphqlClient.post('', query);
      const data = response.data;
      
      if (!data || !data.data || !data.data.activeDailyCodingChallengeQuestion) {
        logger.error('Failed to fetch daily challenge: Invalid response format');
        throw new Error('Failed to fetch daily challenge');
      }

      const dailyChallenge = data.data.activeDailyCodingChallengeQuestion;
      const question = dailyChallenge.question;
      
      logger.info(`Successfully fetched daily challenge: ${question.title}`);
      
      return {
        questionLink: 'https://leetcode.com' + dailyChallenge.link,
        date: dailyChallenge.date,
        questionId: question.questionId,
        questionFrontendId: question.questionFrontendId,
        questionTitle: question.title,
        titleSlug: question.titleSlug,
        difficulty: question.difficulty,
        isPaidOnly: question.isPaidOnly,
        question: question.content,
        exampleTestcases: question.exampleTestcases,
        topicTags: question.topicTags,
        hints: question.hints || [],
        likes: question.likes,
        dislikes: question.dislikes,
        codeSnippets: question.codeSnippets
      };
    } catch (error) {
      logger.error(`Error fetching daily challenge: ${error.message}`);
      throw new Error(`Failed to fetch daily challenge: ${error.message}`);
    }
  }
}

module.exports = LeetCodeService;
