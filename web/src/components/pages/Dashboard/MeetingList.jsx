import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import Loader from "../../Loader";
import getMeetingsForCreator from "../../../utils/getMeetingsStudent";

const MeetingCard = ({ title, description, date, start, end }) => {
  const s = moment(start, "HH:mm:ss");
  const e = moment(end, "HH:mm:ss");
  const duration = e.diff(s, "hours");

  const timeLeft = moment().to(date);
  const formattedDate = moment(date).format("MMMM Do YYYY");

  return (
    <div className="meeting-card-container container">
      <div className="leftpane-card container column">
        <p>{title}</p>
        <p>{description}</p>
        <div className="time-container container two-gap">
          <div className="time-tracker-container">
            <div className="img-container">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2088/2088617.png"
                alt="clock-icon"
              />
            </div>
            <div>{`Duration: ${duration} ${
              duration !== 1 ? "hrs" : "hr"
            }`}</div>
          </div>
          <div className="time-tracker-container">
            <div className="img-container">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2838/2838779.png"
                alt="calendar-icon"
              />
            </div>
            <div>{`Time left: ${timeLeft}`}</div>
          </div>
          <div className="time-tracker-container">
            <div className="img-container">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2838/2838779.png"
                alt="calendar-icon"
              />
            </div>
            <div>{`Date: ${formattedDate}`}</div>
          </div>
        </div>
      </div>
      <div className="rightpane-card container">
        <div className="status-indicator-container"></div>
        <p className="status-container">New</p>
      </div>
    </div>
  );
};

const MeetingList = ({ url = "pending-meetings/creator" }) => {
  const [meetingsList, setMeetingsList] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        const { meetings } = await getMeetingsForCreator(user, url);

        setMeetingsList(meetings);
        setLoading(false);
      } catch (error) {
        setMeetingsList(null);
        setLoading(false);
      }
    })();
  }, [url]);

  return (
    <>
      <div className="rightpane-header container border-style">
        <p>
          Today <br />
          {moment().format("LLLL")}
        </p>

        <button
          className="addNewMeeting-button-container"
          onClick={(e) => {
            navigate("/dashboard/meetings-list/dashboard-meeting-form");
          }}
          disabled={isLoading}
        >
          <div className="img-container">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2997/2997933.png"
              alt="add-button"
            />
          </div>
          <p>New Meeting</p>
        </button>
      </div>
      <div className="rightpane-content-container container column border-style flex ">
        {isLoading ? (
          <Loader className="container center-content disable-scollbar flex" />
        ) : meetingsList ? (
          meetingsList.map((meeting, index) => (
            <MeetingCard
              key={index}
              title={meeting.title}
              description={meeting.description}
              date={meeting.date}
              start={meeting.time.start}
              end={meeting.time.end}
            />
          ))
        ) : (
          <div className="container center-content max-size">
            Wow such empty...
          </div>
        )}
      </div>
    </>
  );
};

export default MeetingList;
