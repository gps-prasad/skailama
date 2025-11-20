import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CiClock1 } from "react-icons/ci";
import styles from "../styles/eventLogsPopup.module.css"
import { useSelector } from "react-redux";
import dayjs from "dayjs";

export default function EventLogsPopup({open, setOpen}) {
    const logs = useSelector((state) => state.events.eventLogs);
    console.log('event logs',logs)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Event update history</DialogTitle>
            <DialogDescription className={styles.logsList}>
                {logs?.length === 0 ? (
                    <p>No logs available</p>
                ) : (
                    logs.map((log) => (
                    <div key={log.id} className={styles.logItem}>
                        <p className={styles.logUpdationTime}><CiClock1/>{dayjs(log.changedAt).format("YYYY-MM-DD HH:mm:ss")}</p>
                        <p>{log.message}</p>
                    </div>
                    ))
                )}
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>
    )
}