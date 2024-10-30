import React, { useState, useContext } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { authContext } from '../../context/AuthContext'; // Adjust path to your context
import { toast } from 'react-toastify'; // Optional: For showing success/error notifications
import { token } from '../../config'; // Ensure token is retrieved properly

const FeedbackForm = ({ doctorId, onFeedbackSubmitted }) => {
    const { user } = useContext(authContext); // Access user info from AuthContext
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
    
        if (!user || !user.role || !token) {
            toast.error('User not authenticated. Please log in to submit feedback.');
            return;
        }
    
        if (user.role !== 'patient') {
            toast.error('Only patients can submit feedback.');
            return;
        }
    
        if (!reviewText.trim() || rating === 0) {
            toast.error('Please provide a rating and feedback message.');
            return;
        }
    
        const reviewData = {
            reviewText: reviewText.trim(),
            rating
        };
    
        try {
            setLoading(true);
            const response = await fetch(`http://localhost/hospitalWebPage/backend/api/v1/doctors/${doctorId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reviewData)
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to submit feedback: ${errorText}`);
            }
    
            const result = await response.json();
    
            toast.success('Feedback submitted successfully!');
    
            // Add the new review to the existing list of reviews immediately
            const newReview = {
                ...result.data, // Include the returned review data with the user's name
                reviewer_name: user.name // Use the current user's name
            };
    
            onFeedbackSubmitted(newReview); // Update the feedback list
    
            // Clear form inputs
            setReviewText('');
            setRating(0);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('Failed to submit feedback.');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <form onSubmit={handleSubmitReview}>
            <div>
                <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4">
                    How would you rate the overall experience?*
                </h3>
                <div>
                    {[...Array(5).keys()].map((_, index) => {
                        index += 1;
                        return (
                            <button
                                key={index}
                                type="button"
                                className={`${
                                    index <= (hover || rating) ? 'text-yellowColor' : 'text-gray-500'
                                } bg-transparent border-none outline-none text-[20px] cursor-pointer`}
                                onClick={() => setRating(index)}
                                onMouseEnter={() => setHover(index)}
                                onMouseLeave={() => setHover(rating)}
                                onDoubleClick={() => {
                                    setHover(0);
                                    setRating(0);
                                }}
                            >
                                <span>
                                    <AiFillStar />
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-[30px]">
                <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
                    Share your feedback or suggestions*
                </h3>

                <textarea
                    className="border border-solid border-[#0066ff34] focus:outline outline-primaryColor w-full px-4 py-3 rounded-md"
                    rows="5"
                    placeholder="Write your message"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                ></textarea>

                <button
                    type="submit"
                    className="btn transition-transform duration-100 ease-in-out active:scale-95 active:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </div>
        </form>
    );
};

export default FeedbackForm;
