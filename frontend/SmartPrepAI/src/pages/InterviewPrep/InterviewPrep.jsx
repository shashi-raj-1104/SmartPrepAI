import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, scale } from "framer-motion";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import moment from 'moment';
import RoleInfoHeader from "../InterviewPrep/components/RoleInfoHeader";
import axiosInstance from '../../utilis/axiosInstance';
import { API_PATHS } from '../../utilis/apiPaths';
import QuestionCard from "../../components/Cards/QuestionCard";
import AIResponsePreview from './components/AIResponsePreview';
import Drawer from "../../components/Drawer";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState();
  const [errorMsg, setErrorMsg] = useState("");

  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  const [showCustomQuestionInput, setShowCustomQuestionInput] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);

  const [error, setError] = useState("");

  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );

      if (response.data && response.data.session) {
        setSessionData(response.data.session);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setExplanation(null);

      setIsLoading(true);
      setOpenLeanMoreDrawer(true);

      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, {
        question,
      });

      if (response.data) {
        setExplanation(response.data);
      }
    } catch (error) {
      setExplanation(null);
      setErrorMsg("Failed to generate explanation, Try again later ");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId)
      );

      console.log(response);

      if (response.data && response.data.question) {
        await fetchSessionDetailsById();
      }
    } catch (error) {
      console.error("Error:", error);
    }

  };

  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true);

      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: sessionData?.role,
        experience: sessionData?.experience,
        topicsToFocus: sessionData?.topicsToFocus,
        numberOfQuestions: 10,
      });

      const generatedQuestions = aiResponse.data;

      const response = await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
        sessionId,
        questions: generatedQuestions,

      });

      if (response.data) {
        // toast.success("Added MoreQ&A!!");
        await fetchSessionDetailsById();
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    } finally {
      setIsUpdateLoader(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axiosInstance.delete(API_PATHS.QUESTION.DELETE(questionId));
      await fetchSessionDetailsById(); // Refresh session data
    } catch (error) {
      console.error("Failed to delete question:", error);
      // Optionally: show toast or set errorMsg
    }
  };


  const handleAddCustomQuestion = async () => {
    try {
      setIsSubmittingCustom(true);
      if (!customQuestion.trim()) {
        setError("Question cannot be empty.");
        return;
      }
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.ADD_CUSTOM_QUESTION,
        {
          question: customQuestion.trim(),
        }
      );

      const generatedQuestions = aiResponse.data;
      console.log(generatedQuestions);
      await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
        sessionId,
        questions: [{
          question: generatedQuestions.correctedQuestion,
          answer: generatedQuestions.answer
        }],
      });

      if (generatedQuestions.correctedQuestion && generatedQuestions.answer) {
        await fetchSessionDetailsById();
        setCustomQuestion("");
        setShowCustomQuestionInput(false);
      }
      
    } catch (error) {
      if (error.generatedQuestions && error.generatedQuestions.data.message) {
        setErrorMsg(error.generatedQuestions.data.message);
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmittingCustom(false);
    }
  };




  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }
    return () => { };
  }, []);
  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        desciption={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY") : ""
        }
      />
      <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        <h2 className='text-lg font-semibold color-black'>
          Interview Q & A
        </h2>

        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div className={`col-span-12 ${openLeanMoreDrawer ? "md:col-span-7" : "md:col-span-8"}`}>
            <AnimatePresence>
              {sessionData?.questions?.map((data, index) => {
                return (
                  <motion.div
                    key={data._id || index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.1,
                      damping: 15,
                    }}
                    layout
                    layoutId={`question-${data._id || index}`}
                  >

                    <>
                      <QuestionCard
                        question={data?.question}
                        answer={data?.answer}
                        onLearnMore={() => generateConceptExplanation(data.question)}
                        isPinned={data?.isPinned}
                        onTogglePin={() => toggleQuestionPinStatus(data._id)}
                        onDelete={() => handleDeleteQuestion(data._id)}
                      />


                      {!isLoading && sessionData?.questions?.length === index + 1 && (
                        <div className="flex flex-col items-center justify-center mt-5 space-y-4">
                          <button
                            className='flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 rounded cursor-pointer'
                            disabled={isLoading || isUpdateLoader}
                            onClick={uploadMoreQuestions}
                          >
                            {isUpdateLoader ? <SpinnerLoader /> : <LuListCollapse className='text-lg' />}{" "}
                            Load More
                          </button>

                          <button
                            className='text-blue-600 underline text-sm cursor-pointer'
                            onClick={() => setShowCustomQuestionInput(prev => !prev)}
                          >
                            {showCustomQuestionInput ? "Cancel" : "Add Custom Question"}
                          </button>

                          {showCustomQuestionInput && (
                            <div className="w-full max-w-xl mt-3">
                              <textarea
                                rows={3}
                                value={customQuestion}
                                onChange={(e) => setCustomQuestion(e.target.value)}
                                placeholder="Type your custom question here..."
                                className="w-full p-2 border rounded resize-none"
                                disabled={isSubmittingCustom}
                              />
                              <button
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                                onClick={handleAddCustomQuestion}
                                disabled={isSubmittingCustom || !customQuestion.trim()}
                              >
                                {isSubmittingCustom ? "Adding..." : "Generate Answer & Add Question"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        <div className="">
          <Drawer
            isOpen={openLeanMoreDrawer}
            onClose={() => setOpenLeanMoreDrawer(false)}
            title={!isLoading && explanation?.title}
          >
            {errorMsg && (
              <p className='flex gap-2 text-sm text-amber-600 font-medium'>
                <LuCircleAlert className='mt-1' /> {errorMsg}
              </p>
            )}
            {isLoading && <SkeletonLoader />}
            {!isLoading && explanation && (
              <AIResponsePreview content={explanation?.explanation} />
            )}
          </Drawer>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default InterviewPrep
