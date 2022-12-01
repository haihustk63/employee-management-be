import {
  TEST_QUESTION_LEVEL_OBJECT,
  TEST_QUESTION_TYPE_OBJECT,
} from "@constants/type";
import { Request, Response } from "express";

const getTestQuestionContant = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    switch (name) {
      case "levels": {
        return res.status(200).send({ levels: TEST_QUESTION_LEVEL_OBJECT });
      }
      case "types": {
        return res.status(200).send({ types: TEST_QUESTION_TYPE_OBJECT });
      }
      default: {
        res.sendStatus(404);
      }
    }
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

export { getTestQuestionContant };
