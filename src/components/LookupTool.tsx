import React, { useState } from "react";
import { Card } from "./ui/card";
import { CardHeader } from "./ui/card";
import { CardTitle } from "./ui/card";
import { CardDescription } from "./ui/card";
import { CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CameraIcon, CarIcon, LoaderIcon, ImageIcon, ScanLineIcon } from "lucide-react";

interface LookupToolProps {
  speak?: (text: string) => void;
}

interface ScannedData {
  type: string;
  number: string;
  name: string;
  address: string;
  dob: string;
  expiration: string;
  class: string;
  restrictions: string;
}

export default function LookupTool({ speak }: LookupToolProps) {
  const [plateNumber, setPlateNumber] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [scannedDocument, setScannedDocument] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);

  // Simulate license plate lookup
  const lookupPlate = () => {
    if (!plateNumber.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      speak?.(`Plate ${plateNumber.toUpperCase()} belongs to a 2020 Toyota Camry. Registration is valid. No alerts.`);
      setIsProcessing(false);
    }, 2000);
  };

  // Simulate document scanning
  const scanDocument = () => {
    setShowScanner(true);
    setIsProcessing(true);
    setTimeout(() => {
      setScannedDocument('/driver-license-la.jpg');
      setScannedData({
        type: "Louisiana Driver's License",
        number: "1234567",
        name: "SMITH, JOHN D",
        address: "123 MAIN ST, BATON ROUGE LA 70801",
        dob: "01/15/1985",
        expiration: "01/15/2026",
        class: "E",
        restrictions: "NONE"
      });
      speak?.("Document scan complete. Louisiana driver's license for John Smith identified.");
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* License Plate Recognition */}
      <Card className="bg-blue-950/10 border-blue-900/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-blue-300 text-sm flex items-center gap-2">
            <CarIcon className="h-4 w-4" />
            License Plate Lookup
          </CardTitle>
          <CardDescription className="text-blue-400/70 text-xs">
            Scan or enter plate number
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pb-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter plate #"
              className="bg-black/70 border-blue-900/50"
              value={plateNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlateNumber(e.target.value)}
            />
            <Button
              size="icon"
              variant="outline"
              className="bg-blue-900/30 border-blue-900/50"
            >
              <CameraIcon className="h-4 w-4 text-blue-300" />
            </Button>
          </div>
          <Button
            onClick={lookupPlate}
            disabled={!plateNumber.trim() || isProcessing}
            className="w-full bg-blue-700 hover:bg-blue-800"
          >
            {isProcessing ? (
              <LoaderIcon className="h-4 w-4 animate-spin" />
            ) : (
              "Lookup Plate"
            )}
          </Button>
          {plateNumber && !isProcessing && (
            <div className="p-2 rounded bg-blue-900/20 text-sm text-blue-300">
              Plate: {plateNumber.toUpperCase()}<br />
              Vehicle: 2020 Toyota Camry<br />
              Status: Valid Registration<br />
              Alerts: None
            </div>
          )}
        </CardContent>
      </Card>
      {/* Document Scanner */}
      <Card className="bg-blue-950/10 border-blue-900/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-blue-300 text-sm flex items-center gap-2">
            <ScanLineIcon className="h-4 w-4" />
            Document Scanner
          </CardTitle>
          <CardDescription className="text-blue-400/70 text-xs">
            Scan IDs and documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pb-2">
          {!showScanner && !scannedDocument && (
            <div className="border-2 border-dashed border-blue-900/30 rounded-lg p-6 flex flex-col items-center justify-center gap-2">
              <ImageIcon className="h-8 w-8 text-blue-900/50" />
              <p className="text-blue-400/70 text-xs text-center">
                Tap button below to scan ID or document
              </p>
            </div>
          )}
          {showScanner && isProcessing && (
            <div className="border-2 border-blue-500/30 rounded-lg p-6 flex flex-col items-center justify-center gap-2 bg-blue-900/10">
              <LoaderIcon className="h-8 w-8 text-blue-400 animate-spin" />
              <p className="text-blue-300 text-xs">Scanning document...</p>
            </div>
          )}
          {scannedDocument && scannedData && (
            <div className="border rounded-lg bg-black/50 p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-blue-300">{scannedData.type}</span>
                <Badge className="bg-green-900/30 text-green-400 text-xs">Verified</Badge>
              </div>
              <div className="text-white/90 text-sm space-y-1">
                <p>Name: {scannedData.name}</p>
                <p>ID #: {scannedData.number}</p>
                <p>DOB: {scannedData.dob}</p>
                <p>Address: {scannedData.address}</p>
                <p>Expiration: {scannedData.expiration}</p>
              </div>
            </div>
          )}
          <Button
            onClick={scanDocument}
            disabled={isProcessing}
            className="w-full bg-blue-700 hover:bg-blue-800"
          >
            {isProcessing ? (
              <>
                <LoaderIcon className="h-4 w-4 mr-1 animate-spin" /> Processing...
              </>
            ) : (
              <>
                <ScanLineIcon className="h-4 w-4 mr-1" /> {scannedDocument ? "Scan New Document" : "Scan Document"}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}