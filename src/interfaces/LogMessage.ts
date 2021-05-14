interface ILogMessage {
  id: number;
  userName: string;
  loggedDate: Date;
  level: string;
  message: string;
}

export default ILogMessage;

