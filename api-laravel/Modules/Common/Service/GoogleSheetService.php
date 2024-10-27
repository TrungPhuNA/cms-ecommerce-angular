<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 10/25/24
 */

namespace Modules\Common\Service;

use Google\Client;
use Google\Service\Sheets;
use Illuminate\Support\Facades\Log;

class GoogleSheetService
{
    public static function getGoogleServiceAccount($serviceAccount = null) {
        if(!$serviceAccount) $serviceAccount = json_decode(env('GOOGLE_SERVICE_ACCOUNT_JSON_LOCATION'), true);
        $client = new Client();
        $client->setAuthConfig(public_path('ldp-register-adv.json'));
        $client->setScopes([Sheets::SPREADSHEETS]);
        $service = new Sheets($client);
        return $service;
    }

    public static function pushDataToSheet($configService = null, $data, $spreadsheetId, $sheetName, $start = '') {
        if(!$configService) {
            $configService = self::getGoogleServiceAccount();
        }


        $response = $configService->spreadsheets_values->get($spreadsheetId, $sheetName);
        $headerKeys = $response->getValues()[0]; // First row as header
        // Map input data to header keys
        $mappedData = array_map(function ($item) use ($headerKeys) {
            $mappedItem = [];
            foreach ($headerKeys as $key) {
                $mappedItem[$key] = $item[$key] ?? '';
            }
            return $mappedItem;
        }, $data);



        $values = [];
        foreach ($mappedData as $item) {
            $values[] = array_values($item); // Convert associative array to indexed array
        }
        $body = new \Google\Service\Sheets\ValueRange([
            'values' => $values
        ]);
        $configService->spreadsheets_values->append(
            $spreadsheetId, // Spreadsheet ID
            "$sheetName$start",
            $body,
            ['valueInputOption' => 'RAW'] // Ensure this option is set correctly
        );
    }

    public static function createSheetName($sheetName, $spreadsheetId, $sheetKey = [], $sheetNotes = [], $service = null) {
        if(!$service) $service = self::getGoogleServiceAccount();
        // Lấy danh sách các sheet hiện tại
        $spreadsheet = $service->spreadsheets->get($spreadsheetId);
        $sheets = $spreadsheet->getSheets();
        // Kiểm tra xem sheet đã tồn tại chưa
        $sheetExists = false;
        foreach ($sheets as $sheet) {
            if ($sheet->getProperties()->getTitle() == $sheetName) {
                $sheetExists = true;
                break;
            }
        }
        // Nếu sheet chưa tồn tại, tạo mới
        if (!$sheetExists) {

            $addSheetRequest = new \Google\Service\Sheets\AddSheetRequest([
                'properties' => ['title' => $sheetName]
            ]);
            $batchUpdateRequest = new \Google\Service\Sheets\BatchUpdateSpreadsheetRequest([
                'requests' => [['addSheet' => $addSheetRequest]]
            ]);

            $response = $service->spreadsheets->batchUpdate($spreadsheetId, $batchUpdateRequest);

            $sheetId = $response->replies[0]->addSheet->properties->sheetId;
            self::customizeRowColor($service, $spreadsheetId, $sheetId, 1,2,0, count($sheetKey));

            // Thiết lập giá trị cho A1 và A2
            $values = [
                $sheetKey,            // Hàng A1
                $sheetNotes       // Hàng A2
            ];

            // Phạm vi (range) cần ghi dữ liệu
            $body = new \Google\Service\Sheets\ValueRange([
                'range' => $sheetName.'!A1',
                'values' => $values
            ]);
            // Ghi dữ liệu vào Google Sheet
            $params = ['valueInputOption' => 'RAW'];
            $service->spreadsheets_values->update($spreadsheetId, $sheetName.'!A1', $body, $params);

            Log::info("Sheet '$sheetName' has been created.");
        } else {
            Log::info("Sheet '$sheetName' already exists.");
        }
        return $sheetName;
    }


    public static function customizeRowColor(
        $service,
        $spreadsheetId,
        $sheetId,
        $startRow = 0,
        $endRow = 0,
        $startCol = 0,
        $endCol = 0)
    {

        // Thiết lập định dạng cho màu nền của hàng thứ 2
        $requests = [
            new \Google\Service\Sheets\Request([
                'repeatCell' => [
                    'range' => [
                        'sheetId' => $sheetId,
                        'startRowIndex' => $startRow, // Hàng thứ 2 (chỉ số bắt đầu từ 0)
                        'endRowIndex' => $endRow,
                        'startColumnIndex' => $startCol, // Cột đầu tiên
                        'endColumnIndex' => $endCol
                    ],
                    'cell' => [
                        'userEnteredFormat' => [
                            'backgroundColor' => [
                                'red' => 1.0,
                                'green' => 0.6,
                                'blue' => 0.0
                            ],
                            'textFormat' => [
                                'fontSize' => 11,
                                'bold' => true
                            ]
                        ]
                    ],
                    'fields' => 'userEnteredFormat(backgroundColor,textFormat)'
                ]
            ])
        ];

        // Tạo yêu cầu cập nhật
        $batchUpdateRequest = new \Google\Service\Sheets\BatchUpdateSpreadsheetRequest([
            'requests' => $requests
        ]);

        // Gửi yêu cầu cập nhật định dạng
        $service->spreadsheets->batchUpdate($spreadsheetId, $batchUpdateRequest);
    }
}