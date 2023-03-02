export const generateSubmitTestEmail = ({
  title,
  duration,
  questionCount = 0,
  essayQuestionCount = 0,
  score,
}: any) => {
  return `
    <p>
    <strong>Congratulations! You have successfully submitted the test!</strong>
    This is the information of the test you have done.
    </p>

    <p>
    <strong>Test title</strong>: ${title}<br />
    <strong>Duration</strong>: ${duration} minutes<br />
    <strong>Number of questions:</strong> ${questionCount}<br />
    <strong>Number of essay questions</strong>: ${essayQuestionCount}<br />
    <strong>Result</strong>: ${score}/${
    questionCount - essayQuestionCount
  } selection questions and ${essayQuestionCount} essay questions waiting for review.
    </p>

    <p>We will contact you within <strong>3 days</strong>. Please not reply this email.</p>
  `;
};
