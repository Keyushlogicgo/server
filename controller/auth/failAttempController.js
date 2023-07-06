import { errorResponse, validateResponse } from "../../helper/apiResponse.js";
import failAttemptModel from "../../model/auth/failAttemptModel.js";

function calculateTimeDuration(selectedNumber) {
  const currentTime = new Date();
  let timeDuration = new Date(currentTime);

  if (selectedNumber <= 3) {
    timeDuration.setMinutes(currentTime.getMinutes() + 1); // Add 1 minute
  } else if (selectedNumber <= 9) {
    const minutesToAdd = Math.pow(5, selectedNumber - 3);
    timeDuration.setMinutes(currentTime.getMinutes() + minutesToAdd); // Add calculated duration based on power of 5
  } else {
    const hoursToAdd = Math.pow(5, selectedNumber - 3 - 6) * 60;
    timeDuration.setMinutes(currentTime.getMinutes() + hoursToAdd); // Add calculated duration based on power of 5 and hours
  }

  return timeDuration;
}

export const fileAttemptMessage = (time) => {
  // Calculate the time difference in milliseconds
  var timeDiff = Math.abs(new Date() - time);

  // Calculate the seconds, minutes, and hours difference
  var secondsDiff = Math.floor(timeDiff / 1000);
  var minutesDiff = Math.floor(secondsDiff / 60);
  var hoursDiff = Math.floor(minutesDiff / 60);

  // If seconds difference is less than 60, count it as one additional minute
  if (secondsDiff < 60) {
    minutesDiff += 1;
  }

  return `Your account is disabled for ${
    hoursDiff !== 0 ? hoursDiff + " hour and " : ""
  }${minutesDiff} minutes`;
};

export const failAttemp = async (res, userId) => {
  try {
    const user = await failAttemptModel.findOne({ userId });

    if (user) {
      const count = user.count + 1;
      let time = new Date();
      if (count >= 3) {
        time = calculateTimeDuration(count);
      }
      return await failAttemptModel.findByIdAndUpdate(
        user._id,
        {
          $set: { count, time },
        },
        { new: true }
      );
    } else {
      const doc = await failAttemptModel({
        count: 1,
        time: new Date(),
        userId,
      });
      return await doc.save();
    }
  } catch (error) {
    return errorResponse({
      res,
      error,
      funName: "failAttemp",
    });
  }
};
