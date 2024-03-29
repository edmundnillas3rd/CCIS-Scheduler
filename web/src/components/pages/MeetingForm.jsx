import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";

import "./MeetingForm.css";
import Loader from "../Loader";
import { useEffect } from "react";

export default function MeetingForm() {
  const [isLoading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(
    moment().add(1, "days").format("YYYY-MM-DD")
  );
  const [day, setDay] = useState(moment().format("DD"));
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("18:00");
  const [venue_id, setVenue] = useState("");
  const [venues, setVenues] = useState([]);
  const [message, setMessage] = useState("");

  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios({
          method: "get",
          url: `${
            import.meta.env.VITE_REACT_APP_BASE_URL
          }/api/student/all-venues`,
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        setVenues(data.venues);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const createMeeting = async () => {
    setLoading(true);

    const meetingInfo = {
      title,
      description,
      date,
      day,
      start,
      end,
      venue_id
    };

    const { data } = await axios({
      method: "post",
      url: `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/student/create-meeting`,
      headers: {
        Authorization: `Bearer ${user.token}`
      },
      data: {
        ...meetingInfo
      }
    });

    const { success_message } = data;

    setMessage(success_message);
    setLoading(false);
  };

  const validateForm = async (e) => {
    e.preventDefault();

    await createMeeting();
    navigate(`/dashboard/${user.role}/meetings-list`);
  };

  return (
    <form
      className="meeting-form-container container column border-style flex"
      method="POST"
      action=""
      onSubmit={validateForm}
    >
      {message && <h3>{message}</h3>}
      <div className="input-container container column">
        <input
          type="text"
          placeholder="Meeting name"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          required
        />
      </div>
      <div className="input-container container column">
        <textarea
          name="description"
          id="description"
          cols="30"
          rows="10"
          placeholder="Enter meeting description"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          required
        ></textarea>
      </div>
      <div className="input-container container column">
        <label htmlFor="meeting-date">Meeting Date</label>
        <input
          type="date"
          name="meeting-date"
          id="meeting-date"
          min={date}
          required
          onChange={(e) => {
            setDate(e.target.value);
            const formattedDate = new Date(e.target.value);
            setDay(formattedDate.getDate());
          }}
          value={date}
        />
      </div>
      <div className="input-container container column">
        <label htmlFor="starting_time">Starting Time:</label>
        <input
          type="time"
          name="starting_time"
          id="starting_time"
          onChange={(e) => {
            setStart(e.target.value);
          }}
          required
          value={start}
        />
      </div>
      <div className="input-container container column">
        <label htmlFor="ending_time">Ending Time:</label>
        <input
          type="time"
          name="ending_time"
          id="ending_time"
          onChange={(e) => {
            setEnd(e.target.value);
          }}
          required
          value={end}
        />
      </div>
      <select
        name="meeting_venue"
        id="meeting_venue"
        onChange={(e) => {
          setVenue(e.target.value);
        }}
        required
      >
        <option value="">--Please select a venue--</option>
        {/* <option value="1">Miserior Grounds</option>
        <option value="2">Camp Raymond</option> */}
        {venues &&
          venues.map((venue) => (
            <option value={venue.id} key={venue.id}>{`${venue.area} / ${venue.room}`}</option>
          ))}
      </select>
      <div className="button-container container">
        <button type="submit" disabled={isLoading}>
          {isLoading ? <Loader width={16} height={16} /> : "Add Meeting"}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            navigate(`/dashboard/${user.role}/meetings-list/`);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
