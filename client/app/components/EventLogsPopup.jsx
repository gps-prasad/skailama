'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Clock } from 'lucide-react';
import styles from "../styles/eventLogsPopup.module.css"
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function EventLogsPopup({open, setOpen,event}) {
    const [eventlogs, setEventlogs] = useState([])
    const fetchEventLogs = async (eventId) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/logs/${eventId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        if (data.status === false) {
          console.error(data.message)
          return
        }
        if (!data.logs) {
          setEventlogs([])
          return
        }
        setEventlogs(data.logs.logs)
      } catch (error) {
        setEventlogs([])
        console.error(error)
      }
    }

    useEffect(() => {
      if (!open || !event?._id) return
      fetchEventLogs(event?._id)
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Event update history</DialogTitle>
            <DialogDescription  className={styles.logsList}>
                {eventlogs?.length === 0 ? (
                    <span>No logs available</span>
                ) : (
                    eventlogs.map((log) => (
                    <div key={log._id} className={styles.logItem}>
                        <p className={styles.logUpdationTime}><Clock size={12}/>{dayjs(log.changedAt).format("YYYY-MM-DD HH:mm:ss")}</p>
                        <p className={styles.logMessage}>{log.message}</p>
                    </div>
                    ))
                )}
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>
    )
}