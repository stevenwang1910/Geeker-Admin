<template>
  <div class="card content-box">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="140px">
      <!-- 个人基本信息 -->
      <div class="form-section">
        <h3 class="section-title">个人基本信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="ruleForm.gender" placeholder="请选择性别">
                <el-option label="男" value="male" />
                <el-option label="女" value="female" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker v-model="ruleForm.birthday" type="date" placeholder="请选择出生日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input v-model.number="ruleForm.age" type="number" placeholder="请输入年龄" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="ruleForm.idCard" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="婚姻状况" prop="maritalStatus">
              <el-select v-model="ruleForm.maritalStatus" placeholder="请选择婚姻状况">
                <el-option label="未婚" value="single" />
                <el-option label="已婚" value="married" />
                <el-option label="离异" value="divorced" />
                <el-option label="丧偶" value="widowed" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="民族" prop="nation">
              <el-input v-model="ruleForm.nation" placeholder="请输入民族" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职业" prop="occupation">
              <el-input v-model="ruleForm.occupation" placeholder="请输入职业" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址" prop="address">
          <el-input v-model="ruleForm.address" placeholder="请输入详细地址" />
        </el-form-item>
      </div>

      <!-- 联系方式 -->
      <div class="form-section">
        <h3 class="section-title">联系方式</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="ruleForm.phone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备用电话" prop="backupPhone">
              <el-input v-model="ruleForm.backupPhone" placeholder="请输入备用电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="ruleForm.email" type="email" placeholder="请输入电子邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急联系人" prop="emergencyContact">
              <el-input v-model="ruleForm.emergencyContact" placeholder="请输入紧急联系人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="紧急联系人电话" prop="emergencyPhone">
          <el-input v-model="ruleForm.emergencyPhone" placeholder="请输入紧急联系人电话" />
        </el-form-item>
      </div>

      <!-- 医疗相关信息 -->
      <div class="form-section">
        <h3 class="section-title">医疗相关信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="血型" prop="bloodType">
              <el-select v-model="ruleForm.bloodType" placeholder="请选择血型">
                <el-option label="A" value="A" />
                <el-option label="B" value="B" />
                <el-option label="AB" value="AB" />
                <el-option label="O" value="O" />
                <el-option label="未知" value="unknown" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过敏史" prop="allergyHistory">
              <el-input v-model="ruleForm.allergyHistory" placeholder="请输入过敏史" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="既往病史" prop="pastMedicalHistory">
              <el-input v-model="ruleForm.pastMedicalHistory" placeholder="请输入既往病史" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家族病史" prop="familyMedicalHistory">
              <el-input v-model="ruleForm.familyMedicalHistory" placeholder="请输入家族病史" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否吸烟" prop="smoking">
              <el-switch v-model="ruleForm.smoking" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否饮酒" prop="drinking">
              <el-switch v-model="ruleForm.drinking" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入其他备注信息" rows="3" />
        </el-form-item>
      </div>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">提交注册</el-button>
        <el-button @click="resetForm(ruleFormRef)">重置表单</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="peopleForm">
import { reactive, ref } from "vue";
import { checkPhoneNumber } from "@/utils/eleValidate";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import router from "@/routers/index";

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  name: "",
  gender: "",
  birthday: "",
  age: 0,
  idCard: "",
  maritalStatus: "",
  nation: "",
  occupation: "",
  address: "",
  phone: "",
  backupPhone: "",
  email: "",
  emergencyContact: "",
  emergencyPhone: "",
  bloodType: "",
  allergyHistory: "",
  pastMedicalHistory: "",
  familyMedicalHistory: "",
  smoking: false,
  drinking: false,
  remark: ""
});

// 表单验证规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 2, max: 20, message: "姓名长度应在 2 到 20 个字符之间", trigger: "blur" }
  ],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
  birthday: [{ type: "date", required: true, message: "请选择出生日期", trigger: "change" }],
  age: [
    { required: true, message: "请输入年龄", trigger: "blur" },
    { type: "number", min: 0, max: 150, message: "年龄应在 0 到 150 之间", trigger: "blur" }
  ],
  idCard: [
    { required: true, message: "请输入身份证号", trigger: "blur" },
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: "请输入有效的身份证号", trigger: "blur" }
  ],
  address: [
    { required: true, message: "请输入详细地址", trigger: "blur" },
    { min: 5, message: "地址长度不能少于 5 个字符", trigger: "blur" }
  ],
  phone: [{ required: true, validator: checkPhoneNumber, trigger: "blur" }],
  emergencyContact: [
    { required: true, message: "请输入紧急联系人", trigger: "blur" },
    { min: 2, max: 20, message: "紧急联系人姓名长度应在 2 到 20 个字符之间", trigger: "blur" }
  ],
  emergencyPhone: [{ required: true, validator: checkPhoneNumber, trigger: "blur" }]
});

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      ElMessage.success("患者注册成功！");
      console.log("提交的患者信息:", ruleForm);
      // 跳转到患者列表页面
      router.push("/proTable/useProTable");
    } else {
      console.log("表单验证失败:", fields);
    }
  });
};

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style scoped lang="scss">
@import "./index";
.form-section {
  padding-bottom: 20px;
  margin-bottom: 30px;
  border-bottom: 1px solid var(--el-border-color);
  &:last-child {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: none;
  }
}
.section-title {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
</style>
